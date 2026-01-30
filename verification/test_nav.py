
from playwright.sync_api import sync_playwright, expect

def test_nav(page):
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

    # 1. Dashboard
    page.goto("http://localhost:3000/")
    expect(page.get_by_text("PAINEL DO DIA")).to_be_visible()
    print("Dashboard OK")

    # 2. Projects
    page.goto("http://localhost:3000/projects")
    expect(page.get_by_text("Projetos")).to_be_visible()
    print("Projects OK")

    # 3. Proposals
    page.goto("http://localhost:3000/proposals")
    print(f"URL: {page.url}")
    # Check for something unique to Proposals page
    # e.g., "Propostas" or kicker "FERREIRA" + "PROPOSALS" (key prop_title_suffix)
    # The PageHeader kicker is 'prop_kicker'.
    # If it shows Dashboard, we will see "PAINEL DO DIA".

    if page.get_by_text("PAINEL DO DIA").is_visible():
        print("FAIL: Shows Dashboard on /proposals")
    else:
        print("PASS: Does not show Dashboard on /proposals")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        test_nav(page)
        browser.close()
