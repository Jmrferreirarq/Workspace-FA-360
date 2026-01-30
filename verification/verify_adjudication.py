
from playwright.sync_api import sync_playwright, expect
import json
import time

def test_adjudication(page):
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"Browser error: {exc}"))

    # 1. Setup Data
    page.goto("http://localhost:3000/")

    proposal = {
        "id": "prop-test-1",
        "project": "Villa Test Automation",
        "client": "Client Automation",
        "total": "150000",
        "status": "Enviada",
        "date": "2024-01-01",
        "type": "Moradia",
        "views": 5
    }

    proposal_list_json = json.dumps([proposal])

    page.evaluate(f"""
        localStorage.setItem('fa-local-proposals', '{proposal_list_json}');
    """)

    # Verify storage
    val = page.evaluate("localStorage.getItem('fa-local-proposals')")
    print(f"Storage value: {val}")

    # 2. Go to Proposals Page
    print("Navigating to /proposals...")
    page.goto("http://localhost:3000/#/proposals")

    # Wait for page load
    page.wait_for_load_state("networkidle")

    print(f"Current URL: {page.url}")

    # 3. Check if proposal is visible
    expect(page.get_by_role("heading", name="Villa Test Automation")).to_be_visible()
    # Check status badge specifically (div with Enviada)
    expect(page.locator("div").filter(has_text="Enviada").first).to_be_visible()

    # 4. Click Adjudicar
    page.get_by_role("button", name="Adjudicar").click()

    # 5. Check Modal
    expect(page.get_by_text("Confirmar Adjudicação")).to_be_visible()
    # Check that project name is in the modal (paragraph)
    expect(page.get_by_role("paragraph").filter(has_text="Villa Test Automation")).to_be_visible()

    # Take screenshot of Modal
    page.screenshot(path="verification/adjudicate_modal.png")

    # 6. Confirm
    page.get_by_role("button", name="Adjudicar e Criar").click()

    # 7. Verify Status Change
    expect(page.locator("div").filter(has_text="Adjudicada").first).to_be_visible()
    expect(page.get_by_role("button", name="Adjudicar")).not_to_be_visible()

    # 8. Verify Project Creation
    page.goto("http://localhost:3000/#/projects")
    expect(page.get_by_role("heading", name="Villa Test Automation")).to_be_visible()

    # Take final screenshot
    page.screenshot(path="verification/project_created.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_adjudication(page)
            print("Verification Successful!")
        except Exception as e:
            print(f"Verification Failed: {e}")
        finally:
            browser.close()
