# d3.elasticlists
This is a D3 implementation of the Elastic Lists Filter-Interface originally by Moritz Stefaner ( http://archive.stefaner.eu/projects/elastic-lists ).

A quick demo: http://prjcts.sebastianmeier.eu/elasticlists/index.html

## Performance
- The filtering of the dataset is not yet ideal. I tested datasets up to 10.000 items and the performance is very good. But i have a feeling it could be better. If i find time i need to look into Moritz code and i will try to find out how he did it.

## Todo 
- So far the tool only allows attributes to contain one value, in the future it should be possible that an attribute contains multiple values separated by a custom separator.
- A lock state during animation or a chaining of changes, if a user clicks very fast
- Custom-Animation Time
- Custom Min- and Max-Height
