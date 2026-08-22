import os
import re

for root, _, files in os.walk("./src/components"):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
            new_content = re.sub(r"'/api/([^']+)'", r"`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/\1`", content)
            # Some used fetch("/api/bounties")
            new_content = re.sub(r'"/api/([^"]+)"', r"`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/\1`", new_content)
            
            if new_content != content:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Fixed {path}")
