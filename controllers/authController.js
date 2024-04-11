const JWT = require("jsonwebtoken");
const authModel = require("../models/authModel.js");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { hashPassword, comparePassword } = require("../helper/authHelper.js");

//user signup
const registerController = async (req, res) => {
  try {
    const formData = req.body;

    // Check if user already exists
    const existingUser = await authModel.findOne({
      rollNumber: formData.rollNumber,
    });
    if (existingUser) {
      return res.status(403).send({
        success: false,
        message: "User already registered, please login",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(formData.password);
    formData.password = hashedPassword;
    console.log(formData);
    // Create new user
    const user = new authModel({
      ...formData,
    });
    console.log(user);
    await user.save();
    // Send registration email
    sendRegistrationEmail(user.email, user.name);
    res.status(200).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

// Function to send registration email
const sendRegistrationEmail = async (userEmail, username) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // Your email configuration, such as service, auth, etc.
    service: "gmail",
    auth: {
      user: "srinibha.srikanth@gmail.com",
      pass: process.env.pass,
    },
  });

  // Define the email body
  const emailBody = `
  

  Hi ${username},
  
  We're excited to welcome you to the [ACM Student Chapter Name] community!  Thanks for registering on our website. 
  
  As a member, you'll gain access to a variety of resources and opportunities to help you grow as a computer scientist:
  
 Connect with fellow students : Network with other ACM members who share your passion for computing.
Attend workshops and events : Participate in workshops, talks, and other events focused on the latest technologies and trends.
Get involved in projects : Collaborate on projects with other members to gain practical experience.
Stay informed : Receive updates on upcoming events, scholarship opportunities, and other relevant news.
  
  Get Started
  
 Visit our website: [link to your ACM Student Chapter website]
 Join our [communication platform, e.g., Discord, Slack] server: [link to your server] (if applicable)
 Follow us on social media: [link to your social media pages, if applicable]
  
  We encourage you to actively participate in our community and take advantage of all the resources we have to offer. If you have any questions, please don't hesitate to reach out to us at [your email address].
  
  Welcome aboard!
  
  Best regards,
  
  The ACM Student Chapter Name 
  
    `;

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "srinibha.srikanth@gmail.com",
    to: userEmail,
    subject: "Welcome to the ACM Student Chapter !",
    text: emailBody,
  });

  console.log("Email sent: %s", info.messageId);
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body; // Destructure 'username' instead of 'rollNumber'

    // Check if the user exists based on the provided 'username'
    const user = await authModel.findOne({ username });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User is not registered",
      });
    }

    // Compare the provided password with the hashed password in the database
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate JWT token for authentication
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Send successful login response with token and user details
    res.status(200).send({
      success: true,
      message: "login successfully",
      user,
      _id: user._id,
      token,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//admin signup
const registerAdminController = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;

    // //check user
    // const exisitingUser = await authModel.findOne({ userusername });
    // //exisiting user
    // if (exisitingUser) {
    //   return res.status(200).send({
    //     success: false,
    //     message: "Already Registered please login",
    //   });
    // }
    if (password === confirmPassword) {
      //register user
      const hashedPassword = await hashPassword(password);
      //save
      const user = await new authModel({
        username,
        email,
        password: hashedPassword,
        role,
      }).save();

      //   // Send registration email
      //   sendRegistrationEmail(user.email);

      res.status(201).send({
        success: true,
        message: "User Register Successfully",
        user,
      });
    } else {
      res.status(203).send({
        success: false,
        message: "Passwords do not match",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

//admin login
const loginAdminController = async (req, res) => {
  try {
    const { username, password } = req.body;

    //check user
    const user = await authModel.findOne({ username });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user,
      _id: user._id,
      token,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  registerAdminController,
  loginAdminController,
};
