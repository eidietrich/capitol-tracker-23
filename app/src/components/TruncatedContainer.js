import React, { useState } from 'react'
import { css } from '@emotion/react'

import { bottomFadeCss, inlineButtonCss } from '../config/styles.js'

const centeredButtonCss = css`
    display: block;
    margin: 0 auto;
    font-size: 1.1em;
`
const contentCss = css`
    margin-bottom: 0.5em;
`

const TruncatedContainer = (props) => {
    const { children } = props
    const truncateHeight = props.height || 500
    const openedText = props.openedText || 'See less'
    const closedText = props.closedText || 'See all'

    const [isClosed, setClosedState] = useState(true)
    const toggleClosedState = () => isClosed ? setClosedState(false) : setClosedState(true)

    const truncateCss = css`
        height: ${truncateHeight}px;
        overflow: hidden;
    `
    return <div>
        <div css={isClosed ? [truncateCss, bottomFadeCss, contentCss] : [contentCss]}>{children}</div>
        <button css={[inlineButtonCss, centeredButtonCss]} onClick={toggleClosedState}>
            {
                isClosed ? closedText : openedText
            }
        </button>
    </div >
}
export default TruncatedContainer