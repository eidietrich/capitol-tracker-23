import React from "react";
import { css } from '@emotion/react'
import { AnchorLink } from "gatsby-plugin-anchor-links";

import { embedInputContainerStyle } from '../config/styles'

import {
    billStatusSymbols,
    billProgressStepLabels,
    statusColors,
    partyColors
} from '../config/config'

const billCardCss = css`
    width: 300px;
    height: 300px;
    background: var(--tan1);
    position: relative;
    font-size: 15px;

    .title {
        

        font-size: 1.1em;
        text-align: center;
        background: var(--gray6);
        
        color: white;
        padding: 0.5em;
        /* height: 40px; */
        .explanation {
            font-style: italic;
            font-size: 0.9rem;
        }
    }
    .sponsor {
        padding: 0.5em;
    }
    .status {
        padding: 0.5em;
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        /* padding: 0.5em; */

    }
    .info-boxes {
        flex: 0 0 45%;
    }
    .info-text,
    .info-fiscal,
    .info-legal {
        border: 1px solid var(--tan4);
        padding: 0.25em;
        margin: 0 0.5em;
        margin-bottom: 5px;
        height: 30px;
        display: flex;
        align-items: center;
    }
    .info-absent {
        opacity: 0.5;
        font-style: italic;
    }
    .progression {
        flex: 0 0 45%;
        height: 111px;
        border: 1px solid var(--tan4);
        padding: 0.5em;

        .progress-title {
            margin-bottom: 0.3em;
        }
    }

    
    .promo {
        font-style: italic;
        position: absolute;
        bottom: 5px;
        padding: 0.5em;
    }
`

const progressStepStyle = css`
  margin-bottom: 0.1em;
  
  .icon {
    /* background-color: var(--gray1); */
    display: inline-block;
    width: 1.2em;
    height: 1.2em;
    text-align: center;
    margin: 0.1em;
    margin-right: 0.5em;
  }
  .label {
    color: var(--gray4);
    display: inline-block;
    text-transform: uppercase;
    @media (max-width: 400px) {
      font-size: 12px;
    }
  }
`

const BillCard = ({ pageContext, location }) => {
    const {
        bill,
    } = pageContext
    const embedUrl = location.href
    const {
        key, identifier, title, status, progress, chamber,
        lawsUrl, vetoMemoUrl, articles, actions, textUrl, fiscalNoteUrl, legalNoteUrl,
        explanation, type, sponsor, requestor,
    } = bill

    const embedCode = `<div class="alignleft">
<iframe
    width="300px"
    height="300px"
    scrolling="no"
    title="Card embed ${identifier}: ${title}"
    style="border: 1px solid #666;
    box-shadow: 1px 1px 2px #444;"
    src=${embedUrl}#embed"
    ></iframe>
</div>
`
    const stepLabels = billProgressStepLabels(chamber)
    const progression = progress
        .filter(d => ['first committee', 'first chamber', 'second chamber', 'governor'].includes(d.step))
        .map(d => {
            const symbol = billStatusSymbols[d.status]
            return <div key={d.step} css={progressStepStyle}>
                <span className="icon" style={{
                    color: symbol.color,
                    // border: `2px solid ${symbol.color}`
                }}>{symbol.icon}</span>
                <span className="label" >{stepLabels[d.step]}</span>
            </div >
        })

    return <div>
        <div id="embed" css={billCardCss}>
            <div className="title">
                <div>{identifier}: <AnchorLink to={`/bills/${key}`}>{title}</AnchorLink></div>
                <div className="explanation">{explanation}</div>
            </div>

            <div className="sponsor">Sponsor: {sponsor.name} ({sponsor.party}-{sponsor.locale})</div>
            {/* <div className="requestor">Requestor: {requestor}</div> */}
            <div className="status">{status.key.replace('--', ' — ')}</div>
            <div className="row">
                <div className="info-boxes">
                    <div className="info-text">{textUrl ?
                        <a href={textUrl} target="_blank" rel="noopener noreferrer">📃 Bill text</a> :
                        <span className="info-absent">📃 No bill text</span>}
                    </div>
                    <div className="info-fiscal">{fiscalNoteUrl ?
                        <a href={fiscalNoteUrl} target="_blank" rel="noopener noreferrer">💵 Fiscal note</a> :
                        <span className="info-absent">💵 No fiscal note</span>}
                    </div>
                    <div className="info-legal">{legalNoteUrl ?
                        <a href={legalNoteUrl} target="_blank" rel="noopener noreferrer">🏛 Legal note</a> :
                        <span className="info-absent">🏛 No legal note</span>}
                    </div>

                </div>
                <div className="progression">
                    <div className="progress-title">Progress</div>
                    {progression}
                </div>
            </div>
            <div className="promo">🗒 <AnchorLink to={`/bills/${key}`}>More info</AnchorLink> on MTFP's 2023 Capitol Tracker</div>
        </div>

        <div css={embedInputContainerStyle}>
            <div>Embed code (Copy into HTML block in MTFP CMS)</div>
            <textarea rows="20" cols="80" value={embedCode}></textarea>
        </div>

    </div>;
};

export default BillCard;