---
title: 'Organizing Computational Biology Projets'
date: 2022-11-02
permalink: /posts/2022/11/project-organization/
tags:
  - Computational biology
  - Porject organization
---

Two resources I've found really useful in organizing large-scale projects are from Karl Broman's notes on [reproducible research](https://kbroman.org/Tools4RR/assets/lectures/06_org_eda_withnotes.pdf) and William Stafford Noble's paper on [organizing computational biology projects](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2709440/). I'll take the basics--use directories, version code with git, aim for reproducibility--as givens.

The big takeaways for me from Broman's notes are 
1. Split code into directories based on language (`R/`, `python`)
2. Use Makefiles
3. Keep data siloed, and split into directories refelcting how processed it is: `dataRaw`, `dataDerived`, `dataSumaries`, etc.
4. Use CSVs, not xlsx, etc. (Generally, we want cross-platform operability so open source/text files of some sort are preferred)

The big takeaways from Noble's paper are
1. Use dates to sort analyses. We can usually remember approximate chronology, whereas names alone can be 
2. Split out computational experiments
3. Document everything! Biologists are really good at keeping a lab notebook. Do the same!


Highlights of computational biology projects, especially large-scale screening studies.
- Raw sequencing data will (hopefully) be processed only once
- Some data is uses multiple times and/or is shared with collaborators and public data repos. Other data is intermediate for a sub-analysis; once a figure is made the data can be deleted.
- The name of the game is exploratory data analysis. Results generate hypotheses which generate results and on and on.

Principles I'm using now 
- Data that may be used by multiple "sub-analyses" is stored in a sequestered folder (`dataDerived`)
- Similarly, data that is considered "reference" is stored in a sequestered folder
- Data that is unique to a specific sub-analysis (e.g. a list of genes identified as differentially expressed) can be stored in the same folder as the code. To me this highlights the (i) dependence of the code in a particular directory *on* said data and (ii) declutters the common data folders
- Number your scripts in order of operation
  - 0-getReferenceData.sh
  - 1-mungeReferenceData.sh
  - 2-annotateDataToGenes.R
- While consistency in naming is good, don't fret over always using snake or always using camel case. I try to be consistent within a directory, but it's usually not worth the time renaming others files, or renaming the outputes of some open-source software. This of course can be automated, but it's more of a pain than it's worth.
- 

Questions I'm mulling over
- Does the project (github repo) in all its gorey form need to be the same one that you release when you write a paper?
- When do you break up a project into smaller github repos?
