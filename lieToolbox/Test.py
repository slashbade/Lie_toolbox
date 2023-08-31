from weight import Weight
from re import split
def parse_str_weight(input_str, lieType):
    # Complex
    if 'i' in input_str:
        ntype = 'C'
        parts = split(', |,|，| ', input_str)
        real_parts = []
        imag_parts = []
        
        for part in parts:
            print('s', part)
            if 'i' in part:
                # Ordinary complex number
                if '+' in part:
                    real, imag = part.split('+')
                    print(real, imag)
                    real_parts.append(float(real) if real else 0)
                    if imag == 'i':
                        imag_parts.append(1)
                    else:
                        imag_parts.append(float(imag.replace('i', '').strip()))
                # Pure imaginary number
                else:
                    real_parts.append(0)
                    if part == 'i':
                        imag_parts.append(1)
                    else:
                        imag_parts.append(float(part.replace('i', '').strip()))
            # Real number
            else:
                real_parts.append(float(part))
                imag_parts.append(0)

        entry = real_parts + imag_parts
    
    # Real  
    else:
        ntype = 'R'
        entry = list(map(eval, split(', |,|，| ', input_str)))
    return Weight(entry=entry, lieType=lieType, type=ntype)

str1 = '3, 2, 5, 1+i,2+i,3,4,i,7+2i'
str2 = '2, 3, 1, 5, 4'
lbd1 = parse_str_weight(str2, 'B')
lbd1.show()