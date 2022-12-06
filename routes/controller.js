import Record from "../database/dbConnection.js";
import sendMail from "../mail/mail.js";

export const homePage = (req, res) => {
    if (req.isAuthenticated()) {
        Record.find({ id: req.user.googleId }, function (err, foundRecord) {
            let plus = 0, minus = 0;
            foundRecord.forEach((rec) => {
                if (rec.owe === '+') {
                    plus += parseInt(rec.money);
                } else {
                    minus += parseInt(rec.money);
                }
            });
            res.render("home", { records: foundRecord, plus: plus, minus: minus });
        });
    } else {
        res.redirect('/login');
    }
};

export const aboutPage = (req, res) => {
    res.render('about');
};

export const loginPage = (req, res) => {
    res.render('login');
};

export const logOutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
};

export const addData = (req, res) => {
    const newRec = { ...req.body, id: req.user.googleId };
    const myRecord = new Record(newRec);
    myRecord.save(function (err) {
        if (!err) {
            res.redirect('/');
        } else {
            console.log(err);
        }
    });
};

export const modifyPage = (req, res) => {
    if (req.isAuthenticated()) {
        const requestedRecord = req.params.recordId;
        Record.findOne({ _id: requestedRecord }, function (err, foundRecord) {
            res.render("modify", { _id: requestedRecord, name: foundRecord.name, email: foundRecord.email, money: foundRecord.money, owe: foundRecord.owe });
        });
    } else {
        res.redirect('/login');
    }
};

export const updateOrRemoveRecord = (req, res) => {
    const requestedRecord = req.params.recordId;
    var pressedButton = req.body.mod;

    if (pressedButton === "update") {
        Record.findOneAndUpdate({ _id: requestedRecord }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                money: req.body.money,
                owe: req.body.owe
            }
        }, function (err) {
            if (!err) {
                res.redirect('/');
            }
        });
    } else {
        Record.findByIdAndRemove(requestedRecord, function (err) {
            if (!err) {
                res.redirect('/');
            }
        });
    }
};

export const mailToOne = (req, res) => {
    try {
        const requestedId = req.params.reqId;
        const loggedUser = req.user;

        Record.findById(requestedId, function (err, foundId) {
            if (!err) {
                let msg1 = "Mail from Money Tracker!"
                if (foundId.owe == '+') {
                    msg1 = `<p>This is just a friendly reminder that you owe me <span style="color: red;">Rs. ${foundId.money}</span>.</p>`;
                } else {
                    msg1 = `<p>I am aware that I owe you <span style="color: green;">Rs. ${foundId.money}</span>. I'll pay you as soon as possible.</p>`;
                }
                const msg = `<p>Hi, ${foundId.name}! I hope you are doing well.</p>` + msg1 + `<p>Regards,<br>${loggedUser.name} | ${loggedUser.email_id}.</p>`;
                sendMail(foundId.email, msg).then(() => res.redirect('/')).catch((error) => res.send("Invalid Email!"));
            }
        });
    } catch (error) {
        res.redirect('/about');
    }
};