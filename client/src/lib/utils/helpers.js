const displayFirstTextDoc = list => list.map((x, i) => ({ ...x, isDisplayed: i === 0 }))

export {
    displayFirstTextDoc,
}