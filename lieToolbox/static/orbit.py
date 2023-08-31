# from lieToolbox.partition import Partition
from partition import Partition
from copy import deepcopy

class NilpotentOrbit(Partition):
    def __init__(self, entry: list = ..., lieType: str = 'B'):
        super().__init__(entry, lieType)
        self.veryEven = False
        self.veryEvenType = None
        self.entry.sort(reverse=True)
    
    def show(self) -> None:
        """show the orbit itself
        """
        if self.veryEven == True:
            print(self.entry, self.veryEvenType, 'Nilpotent orbit of type D')
        else:
            print(self.entry, 'Nilpotent orbit of type', self.lieType)
        
    
    def char(self):
        """This function returns a string for quick identification of 
        nilpotent orbit type.

        Returns:
            str: e.g. [2, 2, 2, 2] I
        """
        if self.veryEven == False:
            return str(self.entry)
        else:
            return str(self.entry) + " " + str(self.veryEvenType)

    @staticmethod
    def generateOrbitList(n:int, lieType:str) -> list:
        """This function generates all possible equivalent classes of a
        Lie module with dim n using backtrack method

        Args:
            n (int): dimension
            lieType (str): lieType

        Returns:
            list: list of orbits
        """
        if lieType == 'A':
            l = n
        elif lieType == 'B':
            l = 2 * n + 1
        else:
            l = 2 * n
        def backtrack(start, target, path):
            if target == 0:
                pt = NilpotentOrbit(list(path), lieType)
                if pt.isSpecialType():
                    # Very even type
                    if pt.lieType == 'D' and pt.isVeryEven():
                        pt.veryEven = True
                        pt.veryEvenType = 'I'
                        orbitList.append(pt)
                        pt1 = deepcopy(pt)
                        pt1.veryEvenType = 'II'
                        orbitList.append(pt1)
                    else:
                        orbitList.append(pt)
                return 
            for i in range(min(start, target), 0, -1):
                path.append(i)
                backtrack(i, target - i, path)
                path.pop()

        orbitList = []
        backtrack(l, l, [])
        return orbitList
    
    def __gt__(self, other):
        """Partial order of orbits

        Args:
            other (NilpotentOrbit): another orbit

        Returns:
            bool: whether the orbit is higher than the other
        """
        p_1 = self.entry
        p_2 = other.entry
        if len(p_1) <= len(p_2):  # fill zeros to achieve same length
            p_1 += (len(p_2) - len(p_1)) * [0]
        else:
            p_2 += (len(p_1) - len(p_2)) * [0]
        return all([p_1[i] >= p_2[i] for i in range(len(p_1))])

if __name__ == '__main__':
    a = NilpotentOrbit([3, 2, 2, 1], 'B')
    b = NilpotentOrbit([3, 3, 3, 3], 'B')
    print(b > a)
    a.show()
    s = NilpotentOrbit.generateOrbitList(3, 'B')
    for p in s:
        p.show()