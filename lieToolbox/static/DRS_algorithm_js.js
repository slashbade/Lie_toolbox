class ParameterDominoRS {
    /**
     * This constructs a {@link ParameterDominoRS} from either
     * an array of numbers or a space-separated string of those numbers.
     * If input is not given, the constructor returns the representation
     * of the empty signed permutation.
     * {@link TableauSignsSppq}.
     * @param {Object} table
     * @param {number[]} [table.array] - an array of the type required
     * for {@link ParameterDominoRS#parameter}
     * @param {string} [table.parameterString] - the string representation
     * of a signed permutation.
     */
    constructor(table) {
            table = table || {};
            if (table.array) {
                    /**
                     * This is an array which stores the signed permutation.
                     * Functionally, the array is 1-based, that is,
                     * parameter[0] = 0, basically just to discard that entry,
                     * and parameter[i] = j means that the permutation takes i to j.
                     * @type {Array.number}
                     */
                    this.parameter = table.array;
            } else if (table.parameterString) {
                    this.parameter = ParameterDominoRS.parse(table.parameterString).parameter;
            } else {
                    this.parameter = [0];
            }
    }

    /**
     *  makes a deep copy
     *  @return {ParameterDominoRS}
     */
    clone() {
            let parameter = [];
            this.parameter.forEach((item) => parameter.push(item));
            return new ParameterDominoRS({array: parameter});
    }
}

class DominoGrid {
    /**
     * The constructor populates the DominoGrid from an Array of Dominos.
     * @param {Domino[]} dominoList - an array of Dominos (which is often empty).
     */
    constructor(dominoList) {
            /**
             * This is a 2D jagged array with the same shape as the tableau
             * of which it is a member.
             * Each entry of the array stores a reference to the Domino
             * in that position of the tableau.
             * @type {Domino[][]}
             */
            this.grid = [];
            /**
             * This array stores the length of each row of the tableau.
             * @type {number[]}
             */
            this.rowLengths = [];
            /**
             * This array stores the length of each column of the tableau.
             * @type {number[]}
             */
            this.columnLengths = [];
            dominoList.forEach((domino) => { this.addDomino(domino);});
    }

    /**
     * This function sets the grid location at position (x, y) to
     * the <code>domino</code>.
     * @param {number} x
     * @param {number} y
     * @param {Domino} domino
     */
    set(x, y, domino) {
            if (!this.columnLengths[x] || this.columnLengths[x] <= y) {
                    this.columnLengths[x] = y + 1;
            }

            if (!this.rowLengths[y] || this.rowLengths[y] <= x) {
                    this.rowLengths[y] = x + 1;
            }

            if (!this.grid[y]) {
                    this.grid[y] = [];
            }

            this.grid[y][x] = domino;
    }


    /**
     * This function gets the domino at grid location (x, y).
     * @param {number} x
     * @param {number} y
     * @return {Domino|undefined}
     */
    get(x, y) {
            if (!this.rowLengths[y]) {
                    return undefined;
            }

            return this.grid[y][x];
    }

    /**
     * This function gets the content the domino at grid location (x, y).
     * This content may be a number, a sign, or an empty string.
     * If there is no domino at this location,
     * the function returns undefined.
     * @param {number} x
     * @param {number} y
     * @return {number|string|undefined}
     */
    getContent(x, y) {
            let domino = this.get(x, y);
            if (domino) {
                    return domino.n;
            }

            return undefined;
    }

    /**
     * This function sets the grid locations in the position
     * covered by a domino to that domino.
     * @param {Domino} domino
     */
    addDomino(domino) {
            this.set(domino.x, domino.y, domino);
            if (domino.zero) {
                    return;
            }

            if (domino.horizontal) {
                    this.set(domino.x + 1, domino.y, domino);
            } else {
                    this.set(domino.x, domino.y + 1, domino);
            }

            if (domino.box) {
                    this.set(domino.x + 1, domino.y, domino);
                    this.set(domino.x + 1, domino.y + 1, domino);
            }
    }

    

    /**
     * @param {number} i - the zero-based index of the row
     * @return {number} the length of the ith row
     */
    getRowLength(i) {
            if (!this.rowLengths[i]) {
                    return 0;
            }

            return this.rowLengths[i];
    }

    /**
     * @param {number} j - the zero-based index of the column
     * @return {number} the length of the jth column
     */
    getColumnLength(j) {
            if (!this.columnLengths[j]) {
                    return 0;
            }

            return this.columnLengths[j];
    }
}

class Domino {
    /**
     * @param {Object} table
     * @param {number|string} table.n - The number occupying the domino.  Though,
     * in some uses, the domino is occupied by a sign, not a number.  In some cases
     * the domino is blank, that is, <code>table.n == ''</code>.
     * @param {number} table.x - The x-coordinate of the left-most square of the domino in the tableau.
     * Zero-based, zero on the left.
     * @param {number} table.y - The y-coordinate of the highest square of the domino in the tableau.
     * Zero-based, zero on top.
     * @param {boolean} [table.horizontal] - If true, the domino is horizontal,
     * if false, the domino is vertical.
     * @param {boolean} [table.box] - Some members of the Domino class are not actually dominos.
     * If table.box is true, then this domino is a 2x2 box.
     * @param {boolean} [table.zero] - If table.zero is true, this "domino" is actually a 1x1 square,
     * holding a 0, situated in the top-left corner of the tableau.
     * @description Exactly one of the optional parameters will be present.
     */
    constructor(table) {
            /**
             * The content of the Domino
             * @type {number|string}
             */
            this.n = table.n;
            /**
             * The x-coordinate of the left-most square of the domino
             * in the tableau.
             * Zero-based, zero on the left.
             * @type {number}
             */
            this.x = table.x;
            /**
             * The y-coordinate of the highest square of the domino
             * in the tableau.
             * Zero-based, zero on top.
             * @type {number}
             */
            this.y = table.y;
            if (table.box) {
                    /**
                     * If true, then this "domino" is a 2x2 box.
                     * @type {boolean|undefined}
                     */
                    this.box = true;
            } else if (table.zero) {
                    /**
                     * If true, this "domino" is actually a
                     * 1x1 square, holding a 0,
                     * situated in the top-left corner of the tableau.
                     * @type {boolean|undefined}
                     */
                    this.zero = true;
            } else {
                    /**
                     * If true, the domino is horizontal,
                     * if false, the domino is vertical.
                     * @type {boolean|undefined}
                     */
                    this.horizontal = table.horizontal;
            }
    }

    /**
     * makes a copy
     * @return {Domino}
     */
    clone() {
            return new Domino(this);
    }

    /**
     * Creates a zero "domino", that is, a 1x1 square,
     * holding a 0, situated in the top-left corner of the tableau.
     * @return {Domino}
     */
    static makeZero() {
            return new Domino({n: 0, x: 0, y: 0, zero: true});
    }

    /**
     * makes a deep copy of an array of Domino
     * @param {Domino[]} dominoList
     * @return {Domino[]}
     */
    static cloneList(dominoList) {
            let newList = [];
            dominoList.forEach((domino) => {newList.push(domino.clone())});
            return newList;
    }
}

class Tableau {
    /**
     * The constructor creates a Tableau, usually from an Array of Dominos.<br>
     * Often you are constructing an empty tableau,
     * or making a Tableau from an array of Dominos (when cloning a tableau, for example).
     * There is also a version of the constructor which starts with a Tableau
     * and just gives you the same Tableau back again.
     * This is used by the derived class {@link TableauWithGrid}.
     * @param {Object} table
     * @param {Object} [table.tableau] - a Tableau to be copied.
     * @param {Object} [table.dominoList] - an Array of Dominos.
     */
    constructor(table) {
            table = table || {};
            if (table.tableau) {
                    /**
                     * an array of references to the Dominos of the tableau.
                     * @type {Domino[]}
                     */
                    this.dominoList = table.tableau.dominoList;
                    /**
                     * see {@link DominoGrid}
                     * @type {DominoGrid}
                     */
                    this.dominoGrid = table.tableau.dominoGrid;
            } else {
                    this.dominoList = table.dominoList || [];
                    this.dominoGrid = new DominoGrid(this.dominoList);
            }
    }

    /**
     *  makes a deep copy
     *  @return {Tableau}
     */
    clone() {
            return new Tableau({dominoList: Domino.cloneList(this.dominoList)});
    }


    /**
     * This function adds a Domino to the Tableau.
     * @param {Domino} domino - the Domino to add
     */
    insert(domino) {
            let inserted = false;
            for (let i = 0; i < this.dominoList.length; i++) {
                    if (this.dominoList[i].n > domino.n) {
                            this.dominoList.splice(i, 0, domino);
                            inserted = true;
                            break;
                    }
            }

            if (!inserted) {
                    this.dominoList.push(domino);
            }

            this.dominoGrid.addDomino(domino);
    }

    /**
     * This function adds a Domino to the Tableau. It has the same result as
     * the function {@link Tableau#insert}, but it uses a binary search to find the place
     * for the domino in {@link Tableau#dominoList}.
     * @param {Domino} domino - the Domino to add
     */
    insertBinary(domino) {
            let dominoList = this.dominoList;
            let listLength = dominoList.length;
            if (listLength == 0) {
                    dominoList.push(domino);
                    this.dominoGrid.addDomino(domino);
                    return;
            }

            let number = domino.n;
            let index;
            let last = listLength - 1;
            let lastNumber = dominoList[last].n;
            if (number > lastNumber) {
                    dominoList.push(domino);
                    this.dominoGrid.addDomino(domino);
                    return;
            }

            let first = 0;
            let mid = Math.floor((first + last)/ 2);
            while (true) {
                    let midNumber = dominoList[mid].n;
                    if (number < midNumber) {
                            if (mid == first) {
                                    index = mid;
                                    break;
                            }

                            let nextLowerNumber = dominoList[mid - 1].n;
                            if (number > nextLowerNumber) {
                                    index = mid;
                                    break;
                            }

                            // hence number < nextLowerNumber
                            if (first == mid - 1) {
                                    index = first;
                                    break;
                            }

                            last = mid - 1;
                            mid = Math.floor((first + last) / 2);
                    } else { // midNumber < number
                            if (last == mid + 1) {
                                    index = last;
                                    break;
                            }

                            first = mid + 1;
                            mid = Math.floor((first + last) / 2);
                    }
            }

            dominoList.splice(index, 0, domino);
            this.dominoGrid.addDomino(domino);
    }

    /**
     * @param {number} i - the zero-based index of the row
     * @return {number} the length of the ith row
     */
    getRowLength(i) {
            return this.dominoGrid.getRowLength(i);
    }

    /**
     * @param {number} j - the zero-based index of the column
     * @return {number} the length of the jth column
     */
    getColumnLength(j) {
            return this.dominoGrid.getColumnLength(j);
    }


    /**
     * This function adds one number with sign to the tableau,
     * using the Domino Robinson-Schensted procedure.
     * @param {number} rsNumber - the number can be positive or negative
     * @return {Object} {x: number, y: number, horizontal: boolean},<br>
     * an object holding the x and y coordinates
     * and the orientation of the change in the shape of the Tableau.
     */
    nextRobinsonSchensted(rsNumber) {
            let m = rsNumber > 0? rsNumber: -rsNumber;
            let newDomino = new Domino({n: m});
            let dominoGrid = this.dominoGrid;
            let grid = dominoGrid.grid;
            let position;
            let domino1;
            let domino2;

            /**
             * [TODO getRowData description]
             * @param  {number} y      [TODO description]
             * @param  {number} number [TODO description]
             * @return {Object}        [TODO description]
             */
            function getRowData(y, number) {
                    for (let x = 0; ; x++) {
                            let domino1 = dominoGrid.get(x, y);
                            if (!domino1) {
                                    let rowPosition = {x:x, y:y, horizontal: true};
                                    return {position: rowPosition};
                            }

                            if (domino1.n > number) {
                                    let rowPosition = {x:x, y:y, horizontal: true};
                                    let domino2;
                                    if (domino1.horizontal) {
                                            domino2 = domino1;
                                    } else {
                                            domino2 = dominoGrid.get(x + 1, y);
                                    }

                                    return {position: rowPosition, domino1: domino1, domino2: domino2};
                            }
                    }
            }

            function getColumnData(x, number) {
                    for (let y = 0; ; y++) {
                            let domino1 = dominoGrid.get(x, y);
                            if (!domino1) {
                                    let columnPosition = {x:x, y:y, horizontal: false};
                                    return {position: columnPosition};
                            }

                            if (domino1.n > number) {
                                    let columnPosition = {x:x, y:y, horizontal: false};
                                    let domino2;
                                    if (!domino1.horizontal) {
                                            domino2 = domino1;
                                    } else {
                                            domino2 = dominoGrid.get(x, y + 1);
                                    }

                                    return {position: columnPosition, domino1: domino1, domino2: domino2};
                            }
                    }
            }

            let insertData;
            if (rsNumber > 0) {
                    insertData = getRowData(0, m);
            } else { // rsNumber < 0
                    insertData = getColumnData(0, m);
            }

            position = insertData.position;
            domino1 = insertData.domino1;
            domino2 = insertData.domino2;
            newDomino.x = position.x;
            newDomino.y = position.y;
            newDomino.horizontal = position.horizontal;
            this.insert(newDomino);

    }

    

    /**
     * This function adds one number with sign to the tableau,
     * using the Domino Robinson-Schensted procedure.
     * It is the same as {@link Tableau#nextRobinsonSchensted},
     * except that it uses a binary search to find the position
     * to place a domino in a row or column, and it calls
     * {@link Tableau#insertBinary} to update {@link Tableau#dominoList}
     * with the new Domino.
     * @param {number} rsNumber - the number can be positive or negative
     * @return {Object} {x: number, y: number, horizontal: boolean},<br>
     * an object holding the x and y coordinates
     * and the orientation of the change in the shape of the Tableau.
     */
    nextRobinsonSchenstedBinary(rsNumber) {
            let m = rsNumber > 0? rsNumber: -rsNumber;
            let newDomino = new Domino({n: m});
            let dominoGrid = this.dominoGrid;
            let position;
            let domino1;
            let domino2;

            // binary search
            function getRowData(y, number, rowLength) {
                    if (rowLength == 0) {
                            let rowPosition = {x: 0, y: y, horizontal: true};
                            return {position: rowPosition};
                    }

                    let positionX;
                    let last = rowLength - 1;
                    let lastNumber = dominoGrid.getContent(last, y);
                    if (number > lastNumber) {
                            let rowPosition = {x: last + 1, y: y, horizontal: true};
                            return {position: rowPosition};
                    }

                    let first = 0;
                    let mid = Math.floor((first + last) / 2);
                    while (true) {
                            let midNumber = dominoGrid.getContent(mid, y);
                            let same = false;
                            if (number < midNumber) {
                                    if (mid == first) {
                                            positionX = mid;
                                            break;
                                    }

                                    let nextLowerNumber = dominoGrid.getContent(mid - 1, y);
                                    if (number == nextLowerNumber) {
                                            mid--;
                                            nextLowerNumber = dominoGrid.getContent(mid - 1, y);
                                            same = true;
                                    }

                                    if (number > nextLowerNumber) {
                                            positionX = mid;
                                            break;
                                    }

                                    // hence number < nextLowerNumber
                                    if (first == mid - 1) {

                                            positionX = first;
                                            break;
                                    }

                                    last = mid - 1;
                                    mid = Math.floor((first + last) / 2);
                            } else { // midNumber < number
                                    if (same) {
                                            mid++;
                                    } else {
                                            if (dominoGrid.getContent(mid + 1, y) == midNumber) {
                                                    mid++;
                                            }
                                    }

                                    if (last == mid + 1) {
                                            positionX = last;
                                            break;
                                    }

                                    first = mid + 1;
                                    mid = Math.floor((first + last) / 2);
                            }
                    }

                    let rowPosition = {x: positionX, y: y, horizontal: true};
                    let domino1 = dominoGrid.get(positionX, y);
                    let domino2;
                    if (domino1.horizontal) {
                            domino2 = domino1;
                    } else {
                            domino2 = dominoGrid.get(positionX + 1, y);
                    }

                    return {position: rowPosition, domino1: domino1, domino2: domino2};
            }

            // binary search
            function getColumnData(x, number, columnLength) {
                    if (columnLength == 0) {
                            let columnPosition = {x: x, y: 0, horizontal: false};
                            return {position: columnPosition};
                    }

                    let positionY;
                    let last = columnLength - 1;
                    let lastNumber = dominoGrid.getContent(x, last);
                    if (number > lastNumber) {
                            let columnPosition = {x: x, y: last + 1, horizontal: false};
                            return {position: columnPosition};
                    }

                    let first = 0;
                    let mid = Math.floor((first + last) / 2);
                    while (true) {
                            let midNumber = dominoGrid.getContent(x, mid);
                            let same = false;
                            if (number < midNumber) {
                                    if (mid == first) {
                                            positionY = mid;
                                            break;
                                    }

                                    let nextLowerNumber = dominoGrid.getContent(x, mid - 1);
                                    if (number == nextLowerNumber) {
                                            mid--;
                                            nextLowerNumber = dominoGrid.getContent(x, mid - 1);
                                            same = true;
                                    }

                                    if (number > nextLowerNumber) {
                                            positionY = mid;
                                            break;
                                    }

                                    // hence number < nextLowerNumber
                                    if (first == mid - 1) {
                                            positionY = first;
                                            break;
                                    }

                                    last = mid - 1;
                                    mid = Math.floor((first + last) / 2);
                            } else { // midNumber < number
                                    if (same) {
                                            mid++;
                                    } else {
                                            if (dominoGrid.getContent(x, mid + 1) == midNumber) {
                                                    mid++;
                                            }
                                    }

                                    if (last == mid + 1) {
                                            positionY = last;
                                            break;
                                    }

                                    first = mid + 1;
                                    mid = Math.floor((first + last) / 2);
                            }
                    }

                    let columnPosition = {x: x, y: positionY, horizontal: false};
                    let domino1 = dominoGrid.get(x, positionY);
                    let domino2;
                    if (!domino1.horizontal) {
                            domino2 = domino1;
                    } else {
                            domino2 = dominoGrid.get(x, positionY + 1);
                    }

                    return {position: columnPosition, domino1: domino1, domino2: domino2};
            }

            let insertData;
            if (rsNumber > 0) {
                    insertData = getRowData(0, m, this.getRowLength(0));
            } else { // rsNumber < 0
                    insertData = getColumnData(0, m, this.getColumnLength(0));
            }

            position = insertData.position;
            domino1 = insertData.domino1;
            domino2 = insertData.domino2;
            newDomino.x = position.x;
            newDomino.y = position.y;
            newDomino.horizontal = position.horizontal;
            this.insertBinary(newDomino);


            return position;
    }

}


function parse(parameterString) {
    let data = parameterString.split(" ").filter(x => x);
    let parameter = [0];
    data.forEach((datum) => {
            parameter.push(parseInt(datum));
    });
    return new ParameterDominoRS({array: parameter});
}

function RobinsonSchensted(parameterObject) {
    let parameter = parameterObject.parameter;
    let myTableau = new Tableau();
    for (let index = 1; index < parameter.length; ++index) {
            myTableau.nextRobinsonSchensted(parameter[index]);
    }

    return myTableau;
}

function calc(entry) {
    return RobinsonSchensted(parse(entry))
}