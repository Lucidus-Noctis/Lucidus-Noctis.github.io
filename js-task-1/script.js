/**
 * Sorts an array using the bubble sort algorithm.
 * @param {number[]} arr - Array of numbers to sort.
 * @returns {number[]} A new sorted array.
 */
function bubbleSort(arr) {
    let sortedArr = [...arr];

    for (let i = 0; i < sortedArr.length - 1; i++) {
        let swapped = false;

        for (let j = sortedArr.length - 1; j > i; j--) {
            if (sortedArr[j] < sortedArr[j - 1]) {
                [sortedArr[j], sortedArr[j - 1]] = [sortedArr[j - 1], sortedArr[j]];
                swapped = true;                
            }
        }

        if (!swapped) break;
    }

    return sortedArr;
}

/**
 * Sorts an array of numbers using the selection sort algorithm.
 *
 * @param {number[]} arr - The array of numbers to sort.
 * @returns {number[]} A new sorted array.
 */
function selectionSort(arr) {
    let sortedArr = [...arr];

    for (let i = 0; i < sortedArr.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < sortedArr.length; j++) {
            if (sortedArr[j] < sortedArr[minIndex]) {
                minIndex = j;
            }
        }

        if ( minIndex !== i){
            [sortedArr[minIndex], sortedArr[i]] = [sortedArr[i], sortedArr[minIndex]];
        }
    }

    return sortedArr;
}

/**
 * Sorts an array of numbers using the insertion sort algorithm.
 *
 * @param {number[]} arr - The array of numbers to sort.
 * @returns {number[]} A new sorted array.
 */
function insertionSortWithSwap(arr) {
    let sortedArr = [...arr];

    for (let i = 1; i < sortedArr.length; i++) {
        let j = i;
        while (j > 0 && sortedArr[j] < sortedArr[j - 1]) {
            [sortedArr[j], sortedArr[j - 1]] = [sortedArr[j - 1], sortedArr[j]];
            j--;
        }        
    }

    return sortedArr;
}

/**
 * Sorts an array of numbers using the insertion sort algorithm.
 *
 * @param {number[]} arr - The array of numbers to sort.
 * @returns {number[]} A new sorted array.
 */
function insertionSortWithShift(arr) {
    let sortedArr = [...arr];

    for (let i = 1; i < sortedArr.length; i++) {
        let newIndex = i; 
        let currentElement = sortedArr[i];

        while (sortedArr[newIndex - 1] > currentElement) {
            newIndex--;
        }

        if (newIndex !== i) {
            sortedArr.copyWithin(newIndex + 1, newIndex, i);
            sortedArr[newIndex] = currentElement;
        }        
    }

    return sortedArr;
}