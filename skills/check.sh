#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "=========================================="
echo "SKILLS AUDIT & VERIFICATION"
echo "Directory: $DIR"
echo "=========================================="

TOTAL=0
VALID=0
FAILED=0

for skill_dir in "$DIR"/*/; do
  if [ -d "$skill_dir" ]; then
    skill_name=$(basename "$skill_dir")
    skill_file="$skill_dir/SKILL.md"
    TOTAL=$((TOTAL + 1))

    if [ -f "$skill_file" ]; then
      # Check if frontmatter exists
      if grep -q "^---" "$skill_file" && grep -q "name:" "$skill_file" && grep -q "description:" "$skill_file"; then
        echo "  [OK] $skill_name -> $skill_file"
        VALID=$((VALID + 1))
      else
        echo "  [WARN: Missing frontmatter] $skill_name"
        FAILED=$((FAILED + 1))
      fi
    else
      echo "  [FAIL: Missing SKILL.md] $skill_name"
      FAILED=$((FAILED + 1))
    fi
  fi
done

echo "------------------------------------------"
echo "Audit Summary: $VALID / $TOTAL skills valid ($FAILED failed)"
echo "=========================================="

