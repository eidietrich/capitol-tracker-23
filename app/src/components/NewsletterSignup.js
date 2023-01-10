import React from 'react'
import { css } from '@emotion/react'

const style = css`
    background: #191919;
    color: white;
    padding: 1em;
    padding-top: 2em;
    margin-top: 1em;
    margin-bottom: 2em;

.signup {
    /* max-width: 530px; */
    /* margin: 1rem auto; */
    margin-top: 1em;
}

.signupGroup {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1rem;display: flex;
    flex-wrap: wrap;   
}

.message {
    font-size: 1.2em;
    font-weight: bold;
}
.message-2 {
    font-size: 1.1em;
}

.textInput {
    display: inline-block;
    flex: 4 1 15rem;
    margin: -1px;
    height: 2.5rem;
    padding-left: 0.5rem;
    
}
.submitButton {
    display: inline-block;
    flex: 1 1 auto;
    margin: -1px;
    background-color: #F85028;
    border: 1px solid #F85028;
    color: #fff;
    /* height: 1.2em; */
}

.submitButton:hover{
    background-color: #BA892D;
    border: 1px solid #BA892D;
    /* color: #222; */

}
`

const NewsletterSignup = props => {
    return <div css={style}>
        <div className="message">Sign up for CAPITOLIZED</div>
        <div className="message-2">Expert reporting and insight from the Montana Capitol, emailed Tuesdays and Fridays.</div>
        <div className="signup">
            {/* <form action="https://montanafreepress.us12.list-manage.com/subscribe/post?u=488e8508eb4796685ba32c7a7&amp;id=8a3ae13501&amp;f_id=005abbe0f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                <div className="signupGroup">
                    <input className="textInput" type="email" placeholder="Email address" name="EMAIL" id="mce-EMAIL" />
                    <div style={{ 'position': 'absolute', 'left': '-5000px' }} aria-hidden="true">
                        <input type="text" name="b_488e8508eb4796685ba32c7a7_8a3ae13501" tabIndex="-1" defaultValue="" />
                    </div>
                    <button className="submitButton" type="submit" name="subscribe" id="mc-embedded-subscribe">Subscribe</button>
                </div>
            </form > */}
            <form action="https://montanafreepress.us12.list-manage.com/subscribe/post?u=488e8508eb4796685ba32c7a7&amp;id=8a3ae13501&amp;f_id=005abbe0f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                <div id="mc_embed_signup_scroll">
                    <div className="signupGroup">
                        <input className="textInput" type="email" placeholder="Email address" name="EMAIL" id="mce-EMAIL" />
                        <span id="mce-EMAIL-HELPERTEXT" className="helper_text"></span>
                    </div>
                    <div hidden={true}><input type="hidden" name="tags" value="10502557" /></div>
                    <div id="mce-responses" className="clear">
                        <div className="response" id="mce-error-response" style={{ display: "none" }}></div>
                        <div className="response" id="mce-success-response" style={{ display: "none" }}></div>
                    </div>
                    {/* <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups--> */}
                    <div style={{ position: "absolute", left: "-5000px" }} aria-hidden={true}><input type="text" name="b_488e8508eb4796685ba32c7a7_8a3ae13501" tabIndex="-1" value="" readOnly /></div>
                    <button className="submitButton" type="submit" name="subscribe" id="mc-embedded-subscribe">Subscribe</button>
                </div>
            </form>
        </div >
    </div >
}

export default NewsletterSignup


