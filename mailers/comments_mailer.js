const nodemailer=require("../config/nodemailer");

exports.newComment = (comment)=>{
    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from: "Codeial@gmail.com",
        to: comment.user.email,
        subject:"new comment publish",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }

        // console.log('message send',info);
        return;
        
    });
}

