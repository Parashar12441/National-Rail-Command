from bs4 import BeautifulSoup
import esprima

with open('railverse-lite.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
scripts = soup.find_all('script')
for idx, script in enumerate(scripts):
    if script.string:
        try:
            esprima.parseScript(script.string)
            print(f"Script {idx} parsed successfully.")
        except Exception as e:
            print(f"Error in script {idx}: {e}")
