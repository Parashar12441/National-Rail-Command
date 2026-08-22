import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://raw.githubusercontent.com/adarsh0806/Indian-Railway-Stations/master/stations.json",
    "https://raw.githubusercontent.com/vasanthb/indian-railway-stations/master/stations.json",
    "https://raw.githubusercontent.com/apurbadebnath/indianrlystations/master/stations.json"
]

for url in urls:
    try:
        print(f"Trying {url}...")
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, context=ctx) as response:
            data = response.read().decode('utf-8')
            if data:
                with open('stations_data.json', 'w', encoding='utf-8') as f:
                    f.write(data)
                print(f"Success! Saved to stations_data.json. First 100 chars: {data[:100]}")
                break
    except Exception as e:
        print(f"Failed: {e}")
