import React from "react"
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Seo from '../components/Seo'

import participationData from '../data/participation.json'

const Participate = () => {
    const { text } = participationData
    return <div>

        <Layout>

            <h1 id="participation">Participating in the 2021 Legislature</h1>
            <div className="note">Compiled by Amanda Eggert</div>

            <ReactMarkdown>{text}</ReactMarkdown>

        </Layout>
    </div>
}

export const Head = () => (
    <Seo title="Participation"
        description="How to participate in Montana's 2023 Legislature"
        pageRelativeUrl='participation/'
    />
)

export default Participate