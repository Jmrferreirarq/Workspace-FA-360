import sourcesData from '../data/legal/catalog/sources.json';

export interface LegalInput {
  municipalityId: string;
  useType: 'residential' | 'commercial' | 'industrial' | 'services';
  urbanZone?: 'central' | 'historical' | 'expansion' | 'rural';
  areaGross?: number;
  numDwellings?: number;
  areaPlot?: number;
  areaFootprint?: number;
}

export interface LegalResult {
  ruleId: string;
  topic: string;
  title: string;
  value: any;
  unit?: string;
  label: string;
  confidence: 'official_reference' | 'requires_confirmation' | 'manual_check';
  sourceRef?: {
    sourceId: string;
    articleRef: string;
    officialUrl: string;
  };
  notes?: string;
}

export class LegalEngine {
  private sources = sourcesData;

  async loadRules(municipalityId: string) {
    try {
      // Dynamic import for local JSON rules
      const rulesModule = await import(`../data/legal/municipalities/${municipalityId.toUpperCase()}/rules.json`);
      return rulesModule.default.rules;
    } catch (e) {
      console.error(`Could not load rules for ${municipalityId}`, e);
      return [];
    }
  }

  async evaluate(inputs: LegalInput): Promise<LegalResult[]> {
    const rules = await this.loadRules(inputs.municipalityId);
    const results: LegalResult[] = [];

    for (const rule of rules) {
      // 1. Check "when" condition
      if (rule.when) {
        const matches = Object.entries(rule.when).every(([key, values]) => {
          const val = (inputs as any)[key];
          return Array.isArray(values) ? values.includes(val) : values === val;
        });
        if (!matches) continue;
      }

      // 2. Compute value
      let computedValue: any = null;
      if (rule.compute.type === 'fixed') {
        computedValue = rule.compute.value;
      } else if (rule.compute.type === 'formula') {
        computedValue = this.evaluateFormula(rule.compute.expression, inputs);
      }

      results.push({
        ruleId: rule.ruleId,
        topic: rule.topic,
        title: rule.title,
        value: computedValue,
        unit: rule.compute.unit,
        label: rule.compute.label || rule.title,
        confidence: rule.confidence,
        sourceRef: rule.sourceRef,
        notes: rule.notes
      });
    }

    return results;
  }

  private evaluateFormula(expression: string, inputs: LegalInput): number {
    // Basic parser for formulas like "max(numDwellings, ceil(areaGross/120))"
    // Using a safe Function constructor for the MVP, with replaced keywords
    try {
      const sanitized = expression
        .replace(/numDwellings/g, (inputs.numDwellings || 0).toString())
        .replace(/areaGross/g, (inputs.areaGross || 0).toString())
        .replace(/areaPlot/g, (inputs.areaPlot || 0).toString())
        .replace(/areaFootprint/g, (inputs.areaFootprint || 0).toString())
        .replace(/max/g, 'Math.max')
        .replace(/ceil/g, 'Math.ceil')
        .replace(/floor/g, 'Math.floor');
      
      return new Function(`return ${sanitized}`)();
    } catch (e) {
      console.error("Formula eval error:", e);
      return 0;
    }
  }

  getSources(municipalityId: string) {
    const mun = this.sources.municipalities.find(m => m.id === municipalityId);
    if (!mun) return [];
    
    // Flatten all sources from all instruments
    return mun.instruments.flatMap(inst => inst.sources);
  }
}

export const legalEngine = new LegalEngine();
