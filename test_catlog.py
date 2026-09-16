import json

with open("js/products.js", "r", encoding="utf-8") as f:
    text = f.read()

# Verify that KRUSHI_PRODUCTS is valid structure
start = text.find("const KRUSHI_PRODUCTS = [")
end = text.find("];", start)
if start != -1 and end != -1:
    print("Found KRUSHI_PRODUCTS array!")
    # Check count of items
    count = text.count('id: "')
    print(f"Product count: {count}")
    assert count == 24, f"Expected 24 products, got {count}"
    print("Verification success: exactly 24 products detected!")
else:
    print("KRUSHI_PRODUCTS bounds not found")
