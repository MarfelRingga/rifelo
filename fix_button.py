import re

with open('src/components/PhantomDeckProfile.tsx', 'r') as f:
    content = f.read()

target = """                themeColors={{
                  primary: appliedColors.primary,
                  secondary: appliedColors.secondary,
                  accent: appliedColors.accent,
                  background: appliedColors.background,
                  text: appliedColors.text,
                  inputBg: appliedColors.inputBg,
                  inputBorder: appliedColors.inputBorder
                }}"""

replacement = """                themeColors={{
                  primary: appliedColors.primary,
                  secondary: appliedColors.secondary,
                  accent: '#110c0a', // Use dark color for better contrast on gold button
                  background: appliedColors.background,
                  text: appliedColors.text,
                  inputBg: appliedColors.inputBg,
                  inputBorder: appliedColors.inputBorder
                }}"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced button colors")

with open('src/components/PhantomDeckProfile.tsx', 'w') as f:
    f.write(content)

