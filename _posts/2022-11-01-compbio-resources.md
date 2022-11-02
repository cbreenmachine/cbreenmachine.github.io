---
title: 'Computational Biology Resources'
date: 2022-11-01
permalink: /posts/2022/11/blog-post-1/
tags:
  - General
  - Computational biolgy
---

There are a ton of great tools out there, and indexing the

# Data Processing and Manipulation
- bcftools and samtools
- [bedtools](https://bedtools.readthedocs.io/en/latest/) is wonderful at intersecting, overlapping, etc. multiple [BED](https://en.wikipedia.org/wiki/BED_(file_format) ) files. It's the main reason I try to output bed files when building out my own pipelines.
- [bedops](https://bedops.readthedocs.io/en/latest/) is also useful for general BED file manipulation. My favorite function here is (vcf2bed)[https://bedops.readthedocs.io/en/latest/content/reference/file-management/conversion/vcf2bed.html].

# Genomic Annotation and Enrichment Analysis
- [HOMER](http://homer.ucsd.edu/homer/)
- [clusterProfiler](https://bioconductor.org/packages/release/bioc/html/clusterProfiler.html)

# Visualization
- [ggplot2](https://ggplot2.tidyverse.org/) for general figures and customization. I'll make a post about creating themes one day.
- [cowplot](https://cran.r-project.org/web/packages/cowplot/vignettes/introduction.html) for maniplating ggplot objects (especially nice for joining multiple types of plots into one figure)
- [cytoverse](https://cytoscape.org/) for gene set / network analysis. This is a copy-paste tool so you don't need to fuss with downloading software.
