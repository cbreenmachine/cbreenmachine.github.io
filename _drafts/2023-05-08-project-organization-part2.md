# Project Organization

## Background

For the last ~3 years, I have worked on processing and analyzing whole-genome methylation sequencing data. We have about 400 study samples sequenced at about 50x coverage. If you're coming from outside of genomics, Raw data in its compressed form is about 30 TB. There are many intermediate files, many processing steps, and many modes of analyis. 

Some key features of the data:
1. Each sample (corresponding to one patient) has measurements at ~25,000,000 sites along the genome. 
2. We have three groups that have a clear ordering: controls, mild cognitive impairment (intermediate), and Alzheimer's Disease. 

## Problem

### Parallel analyses

Often, we will perform an analysis on a subset of 



If the output is data—script
If the output is figures—script (or Rmd)
If the output is decisions—Rmd a figure can be part of it, but if you’re trying to decide “which parameter to use” or “which method to use” an Rmd with a summary statement at the beginning is a good idea

For each “theme of analysis” 
- Decisions (question like how many nucleotides)
- Scripts
    - Might handle light processing
    - Intermediate data
- Figures

How to sequester data
- Usually parse down enough that you can work on a local machine. But sometime you need to go the opposite direction…


Qualities of this data
- Large scale
- Lots of EDA and data integration

What to do with data + figure? (Like Gene ontologies)

What to do with dead ends?

How to version data?