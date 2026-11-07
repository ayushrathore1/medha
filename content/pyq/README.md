# RTU past papers (local content)

PDFs are **not** committed. Drop cleaned-ready source files here, then run the seed script.

## Layout

```text
content/pyq/rtu/cse/
  sem-03/dsa/2024.pdf
  sem-03/dsa/2023.pdf
  sem-04/dbms/2024.pdf
  ...
```

Semester folders: `sem-01` … `sem-08`. Subject folder names must match catalog slugs (see `medha-backend/data/pastPaperCatalog.js`).

## Pipeline

```bash
# See expected Sem 3–5 paths
node medha-backend/scripts/seedPastPapers.js --manifest

# Dry-run discovery
node medha-backend/scripts/seedPastPapers.js

# Clean links + cover, upload to Cloudinary, upsert Mongo (mirror AIDS)
node medha-backend/scripts/seedPastPapers.js --upload --mirror-aids
```

Clean a single file without seeding:

```bash
node medha-backend/scripts/cleanPyqPdf.js ./paper.pdf ./paper.cleaned.pdf --subject "DSA" --year 2024 --semester 3
```
