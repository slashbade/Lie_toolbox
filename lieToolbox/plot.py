import numpy as np
from weight import *
st = -2
ed = 2
sep = 0.1
N = int((ed - st)/sep) + 1; 
line = np.linspace(st, ed, N)


for j in range(len(line)):
    for k in range(len(line)):
        lbd = Weight([1.1, 2, 0.1, 1.5, 4, 2.5,-1, 7,-3, 6,-8, 5, line[j], line[k]], 'D')
        L_lbd = HighestWeightModule(lbd)
        obt = L_lbd.nilpotentOrbit()
        if obt.veryEven and obt.veryEvenType == 'II':
            lbd.show()
            obt.show()