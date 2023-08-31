# from lieToolbox import HAlgorithm as ha
import HAlgorithm as ha
from copy import deepcopy
"""TODO
    1. expansion method
    2. rewrite of DRS Algorithm
"""

class Partition:
    """This class stores either the infomation of a Young Tableau or the
    representation of nilpotent orbit.
    """

    def __init__(pt, entry: list = [], lieType: str = 'B'):
        pt.entry = entry
        pt.lieType = lieType

    def __add__(pt, other):
        """This function overloads '+' to obtain the union of two partitions.

        Args:
            other (Partition): Partition object

        Returns:
            Partition: Partition object
        """
        pu = []
        p_1 = deepcopy(pt.entry)
        p_2 = deepcopy(other.entry)
        if len(p_1) <= len(p_2):  # fill zeros to achieve same length
            p_1 += (len(p_2) - len(p_1)) * [0]
        else:
            p_2 += (len(p_1) - len(p_2)) * [0]
        for i in range(len(p_1)):
            pu.append(p_1[i] + p_2[i])
        return Partition(pu, pt.lieType)
    
    def __eq__(pt, other):
        """This function compares two partitions (resp. Young Tableau)

        Args:
            other (Partition): Partition object
        
        Returns:
            Bool
        """
        p_1 = pt.entry
        p_2 = other.entry
        while p_1[-1] == 0:
            p_1.pop()
        while p_2[-1] == 0:
            p_2.pop()
        return p_1 == p_2

    def show(pt):
        """This function shows partition itself, which also checks whether
        the partition is special.
        """
        if len(pt.entry) == 0:
            print('Empty')
        else:
            print(pt.entry)

    def isSpecialType(pt):
        """This function checks whether the partition is special, the notation
        is stated as follows:
        Rules for nilpotent orbits
            A_n: Any P(n)
            B_n: so(2n+1), P(1,2n+1), even parts occur with even multiplicity
            C_n: sp(2n), P(-1,2n), odd parts occur with even multiplicity
            D_n: so(2n), P(1,2n), even parts occur with even multiplicity
                except that "very even" partitions -> Type I and Type II

        Returns:
            bool: True or False
        """
        while pt.entry[-1] == 0:  # delete zeros
            pt.entry.pop()
        flag = True

        if pt.lieType == 'A':
            flag = True

        elif pt.lieType == 'B':
            if sum(pt.entry) % 2 == 1:  # check sum
                for p_k in pt.entry:
                    if p_k % 2 == 0:  # B rule
                        if pt.entry.count(p_k) % 2 != 0:
                            flag = False
                            break
            else:
                flag = False

        elif pt.lieType == 'C':
            if sum(pt.entry) % 2 == 0:  # check sum
                for p_k in pt.entry:
                    if p_k % 2 == 1:  # C rule
                        if pt.entry.count(p_k) % 2 != 0:
                            flag = False
                            break
            else:
                flag = False

        elif pt.lieType == 'D':
            if sum(pt.entry) % 2 == 0:  # check sum
                for p_k in pt.entry:
                    if p_k % 2 == 0:  # D rule
                        if pt.entry.count(p_k) % 2 != 0:
                            flag = False
                            break
            else:
                flag = False

        return flag

    def isVeryEven(pt):
        """This function checks whether a partition of type D is very
        even.

        Returns:
            bool: True or False
        """
        if pt.lieType == 'D':
            newp = deepcopy(pt.entry)
            while newp[-1] == 0:  # delete zeros
                newp.pop()
            flag = 0
            for p_k in newp:
                if p_k % 2 == 0 and newp.count(p_k) % 2 == 0:
                    flag += 1
            if flag == len(newp):
                return True
            else:
                return False
        else:
            return False

    def collapse(pt):
        """This function carries out standard collapse operation introduced in
        CM93 to transfer the partition to correct type.
        """
        if pt.lieType == 'A':
            pass
        elif pt.lieType == 'B':
            if sum(pt.entry) % 2 == 0:  # convert to P(2n+1) for type B
                pt.entry[0] += 1
            # pt.show()
            while pt.isSpecialType() == False:
                pt.entry.append(0)
                for i in range(len(pt.entry)):
                    # even
                    if pt.entry[i] % 2 == 0 and pt.entry.count(
                            pt.entry[i]) % 2 == 1:
                        pt.entry[i] -= 1
                        for j in range(i, len(pt.entry)):
                            if pt.entry[j] < pt.entry[i]:
                                pt.entry[j] += 1
                                break
                        break

        elif pt.lieType == 'C':
            while pt.isSpecialType() == 0:
                pt.entry.append(0)
                for i in range(len(pt.entry)):
                    # odd
                    if pt.entry[i] % 2 == 1 and pt.entry.count(
                            pt.entry[i]) % 2 == 1:
                        pt.entry[i] -= 1
                        for j in range(i, len(pt.entry)):
                            if pt.entry[j] < pt.entry[i]:
                                pt.entry[j] += 1
                                break
                        break

        elif pt.lieType == 'D':
            while pt.isSpecialType() == 0:
                pt.entry.append(0)
                for i in range(len(pt.entry)):
                    # even
                    if pt.entry[i] % 2 == 0 and pt.entry.count(
                            pt.entry[i]) % 2 == 1:
                        pt.entry[i] -= 1
                        for j in range(i, len(pt.entry)):
                            if pt.entry[j] < pt.entry[i]:
                                pt.entry[j] += 1
                                break
                        break

        while pt.entry[-1] == 0:  # delete zeros
            pt.entry.pop()

    def restrictedCollapse(pt):
        pass

    def expansion(pt):
        """This function carries out standard expansion operation introduced in
        CM93 to transfer the partition to correct type.
        """
        if pt.lieType == 'A':
            pass
        
        elif pt.lieType == 'B':
            newp = deepcopy(pt.entry)
            for i in range(0, len(pt.entry), 2):
                if pt.entry[i]%2 == 0 and pt.entry[i+1] == pt.entry[i] and (i == 0 or pt.entry[i-1]!=pt.entry[i]):
                    newp[i] += 1
                    newp[i+1] -= 1
            newp.sort(reverse=True)
            pt.entry = newp
            while pt.entry[-1] == 0:
                pt.entry.pop()
        
        elif pt.lieType == 'C':
            for i in range(1, len(pt.entry), 2):
            # print(i)
                if pt.entry[i]%2 == 1 and i+1 < len(pt.entry) and pt.entry[i+1] == pt.entry[i] and pt.entry[i-1] != pt.entry[i]:
                    newp[i] += 1
                    newp[i+1] -= 1
            newp.sort(reverse=True)
            pt.entry = newp
            while pt.entry[-1] == 0:
                pt.entry.pop()
        
        elif pt.lieType == 'D':
            newp = deepcopy(pt.entry)
            for i in range(1, len(pt.entry), 2):
                if pt.entry[i]%2 == 0 and i+1 < len(pt.entry) and pt.entry[i+1] == pt.entry[i] and pt.entry[i-1]!=pt.entry[i]:
                    newp[i] += 1
                    newp[i+1] -= 1
            newp.sort(reverse=True)
            pt.entry = newp
            while pt.entry[-1] == 0:
                pt.entry.pop()
                
    def evenPartition(pt):
        """Get even partition
        """
        if len(pt.entry) == 0:
            p_even = []
        else:
            p_even = []
            for i in range(len(pt.entry)):
                if (pt.entry[i] + i + 1) % 2 == 1:
                    p_even.append(pt.entry[i] - 1)
                else:
                    p_even.append(pt.entry[i])
        return Partition(p_even, pt.lieType)
    
    def oddPartition(pt):
        """Get odd partition
        """
        if len(pt.entry) == 0:
            p_odd = []
        else:
            p_odd = []
            for i in range(len(pt.entry)):
                if (pt.entry[i] + i + 1) % 2 == 0:
                    p_odd.append(pt.entry[i] - 1)
                else:
                    p_odd.append(pt.entry[i])
        return Partition(p_odd, pt.lieType)

    def hollowBoxAlgorithm(pt, lieType):
        """This function carries out H-algorithm.

        Args:
            lieType (str): Lie type
        """
        if len(pt.entry) == 0:
            pass  # do nothing if empty
        else:
            if lieType == 'A':
                pt.entry = ha.H_algorithm(pt.entry, 1)
            elif lieType == 'B':
                pt.entry = ha.H_algorithm(pt.entry, 2)
            elif lieType == 'C':
                pt.entry = ha.H_algorithm(pt.entry, 3)
            elif lieType == 'D':
                pt.entry = ha.H_algorithm(pt.entry, 4)
            elif lieType == 'metaplectic':
                pt.entry = ha.H_algorithm(pt.entry, 5)
    
    def hollowBoxLabel(pt, lieType):
        if len(pt.entry) == 0:
            label = [0]  # do nothing if empty
        else:
            if lieType == 'A':
                label = ha.getLabel(pt.entry, 1)
            elif lieType == 'B':
                label = ha.getLabel(pt.entry, 2)
            elif lieType == 'C':
                label = ha.getLabel(pt.entry, 3)
            elif lieType == 'D':
                label = ha.getLabel(pt.entry, 4)
            elif lieType == 'metaplectic':
                label = ha.getLabel(pt.entry, 5)
        return label

    def convert2Symbol(pt):
        """This function constructs a Lusztig Symbol through partition.

        Returns:
            Symbol: a B-Symbol or D-Symbol
        """
        p = deepcopy(pt.entry)
        if len(p) % 2 == 0:
            p += [0]
        s = [p[len(p) - i - 1] + i for i in range(len(p))]
        bs_even = [int(i / 2) for i in s if i % 2 == 0]
        bs_odd = [int((i - 1) / 2) for i in s if i % 2 != 0]
        if pt.lieType == 'B' or pt.lieType == 'C':
            return Symbol(bs_even, bs_odd, pt.lieType)
        elif pt.lieType == 'D':
            ds_even = bs_even
            ds_odd = [0] + [i + 1 for i in bs_odd]
            return Symbol(ds_even, ds_odd, 'D')



class Symbol:
    """This class handles structure and operation of Lusztig Symbol.
    """

    def __init__(ls,
                 topEntry: list = [],
                 bottomEntry: list = [],
                 lieType: str = 'B'):
        Symbol.topEntry = topEntry
        Symbol.bottomEntry = bottomEntry
        Symbol.lieType = lieType
        Symbol.special = False

    def show(ls):
        """This function shows the Symbol itself.
        """
        print(ls.lieType, 'Symbol')
        print('Top row:', ls.topEntry)
        print('Bottom row', ls.bottomEntry)

    def makeSpecial(ls):
        """This function sorts the top and bottom row to make a special
        Symbol.
        """
        ls_combine = ls.topEntry + ls.bottomEntry
        ls_combine_sp = sorted(ls_combine)
        ls.topEntry = [i for i in ls_combine_sp[::2]]
        ls.bottomEntry = [i for i in ls_combine_sp[1::2]]
        ls.special = True

    def convert2Partition(ls) -> Partition:
        """This function uses Springer correspondance to construct special
        partition from special Symbol.

        Returns:
            Partition: special partition
        """
        if ls.special == False:
            return None
        else:
            if ls.lieType == 'B' or ls.lieType == 'D':
                s_even_sp = [2 * i + 1 for i in ls.topEntry]
                s_odd_sp = [2 * i for i in ls.bottomEntry]
                s_sp = sorted(s_even_sp + s_odd_sp)
                p_sp = [
                    s_sp[len(s_sp) - i - 1] - (len(s_sp) - i - 1)
                    for i in range(len(s_sp))
                ]

            elif ls.lieType == 'C':
                s_even_sp = [2 * i for i in ls.topEntry]
                s_odd_sp = [2 * i + 1 for i in ls.bottomEntry]
                s_sp = sorted(s_even_sp + s_odd_sp)
                p_sp = [
                    s_sp[len(s_sp) - i - 1] - (len(s_sp) - i - 1)
                    for i in range(len(s_sp))
                ]

            while p_sp[-1] == 0:
                p_sp.pop()
            return Partition(p_sp, ls.lieType)


if __name__ == '__main__':
    pt = Partition([4, 3, 3], 'B')
    pt.evenPartition().show()
    
    bs = pt.convert2Symbol()
    bs.makeSpecial()
    bs.show()