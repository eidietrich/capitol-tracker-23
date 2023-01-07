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
        <div className="message">Subscribe to Capitolized</div>
        <div className="message-2">MTFP's twice-weekly email detailing the inner workings of the 2023 Legislature</div>
        <div className="signup">
            <form action="https://montanafreepress.us12.list-manage.com/subscribe/post?u=488e8508eb4796685ba32c7a7&amp;id=8a3ae13501&amp;f_id=005abbe0f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                <div className="signupGroup">
                    <input className="textInput" type="email" placeholder="Email address" name="EMAIL" id="mce-EMAIL" />
                    <div style={{ 'position': 'absolute', 'left': '-5000px' }} aria-hidden="true">
                        <input type="text" name="b_488e8508eb4796685ba32c7a7_8a3ae13501" tabIndex="-1" defaultValue="" />
                        {/* <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups--> */}
                    </div>
                    <button className="submitButton" type="submit" name="subscribe" id="mc-embedded-subscribe">Subscribe</button>
                </div>
            </form >
        </div >
    </div >
}

export default NewsletterSignup