import React from "react"
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Seo from '../components/Seo'
import NewsletterSignup from "../components/NewsletterSignup"
import ContactUs from "../components/ContactUs"

import participationData from '../data/participation.json'


const Participate = ({ location }) => {
    const { text } = participationData
    return <div>

        <Layout location={location}>

            <h1 id="participation">Participating in the 2021 Legislature</h1>
            <div className="note">Compiled by Amanda Eggert</div>

            <ReactMarkdown>{text}</ReactMarkdown>
            <NewsletterSignup />
            <ContactUs />

        </Layout>
    </div>
}

export const Head = () => (
    <Seo title="Participate"
        description="How to participate in Montana's 2023 Legislature"
        pageRelativeUrl='participation/'
    />
)

export default Participate