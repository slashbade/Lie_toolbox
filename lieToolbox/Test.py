from weight import Weight, HighestWeightModule

# Weight operation
lbd = Weight([1.1, 2, 0.1, 1.5, 4, 2.5, -1, 7, -3, 6, -8, 5, 1.6, 0.4], 'D', 'R')
L = HighestWeightModule(lbd)
L.GKdim()