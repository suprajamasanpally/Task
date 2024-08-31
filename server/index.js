const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');



const EmployeeModel = require("./Models/Employee");
const PersonalInfoModel = require("./Models/PersonalInfo");
const EducationalInfoModel = require("./Models/EducationalInfo");
const ProfessionalInfoModel = require("./Models/ProfessionalInfo");
const DocumentUploadModel = require("./Models/DocumentUpload");
const WorkflowModel = require("./Models/Workflow");
const TemplateModel = require("./Models/Template");

const app = express();
app.use(express.json());
app.use(cors());

const VALID_INVITATION_CODE = '7995731183';
const JWT_SECRET = "your_jwt_secret";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

mongoose
  .connect("mongodb://localhost:27017/task")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

  


  app.post('/signup', async (req, res) => {
    const { name, email, password, role, invitationCode } = req.body;
  
    try {
      // Validate role and criteria
      if (role === 'SuperAdmin') {
        // Check if the provided invitation code is correct
        if (invitationCode !== VALID_INVITATION_CODE) {
          return res.status(400).json({ error: 'Invalid invitation code' });
        }
      }
  
      // Check if user already exists
      const existingUser = await EmployeeModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new EmployeeModel({
        name,
        email,
        password: hashedPassword,
        role, // Store the role (UserAdmin or SuperAdmin)
      });
  
      await newUser.save();
      res.json({ status: 'Success', message: 'User registered successfully. You can now log in.' });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Login Route
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await EmployeeModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'No record existed' });
      }
  
      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Wrong password' });
      }
  
      // Generate JWT Token
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({ status: 'Success', token, role: user.role, email: user.email });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Middleware to verify JWT Token (For protected routes)
  const authMiddleware = (role) => {
    return (req, res, next) => {
      const token = req.headers['authorization'];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== role) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded;
        next();
      } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
      }
    };
  };
  
  // Example of a protected route for SuperAdmin
  app.get('/superadmin-only', authMiddleware('SuperAdmin'), (req, res) => {
    res.json({ message: 'SuperAdmin Access Granted' });
  });
  
  // Example of a protected route for UserAdmin
  app.get('/useradmin-only', authMiddleware('UserAdmin'), (req, res) => {
    res.json({ message: 'UserAdmin Access Granted' });
  });
  

app.post("/personal-info", (req, res) => {
  const { email, ...personalInfo } = req.body;
  PersonalInfoModel.findOneAndUpdate({ email }, personalInfo, {
    upsert: true,
    new: true,
  })
    .then((result) => res.json(result))
    .catch((err) => {
      console.error("Personal Info error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/educational-info", (req, res) => {
  const { email, ...educationalInfo } = req.body;
  EducationalInfoModel.findOneAndUpdate({ email }, educationalInfo, {
    upsert: true,
    new: true,
  })
    .then((result) => res.json(result))
    .catch((err) => {
      console.error("Educational Info error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/professional-info", (req, res) => {
  const { email, employers } = req.body;
  console.log("Received data:", { email, employers }); // Log received data
  ProfessionalInfoModel.findOneAndUpdate(
      { email },
      { employers },
      { upsert: true, new: true }
  )
  .then((result) => res.json(result))
  .catch((err) => {
      console.error("Professional Info error:", err);
      res.status(500).json({ error: "Internal Server Error" });
  });
});

app.post(
  "/documents-upload",
  upload.fields([
    { name: "identification[file]", maxCount: 1 },
    { name: "birthCertificate[file]", maxCount: 1 },
    { name: "addressVerification[file]", maxCount: 1 },
    { name: "educationalCredentials[file]", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  (req, res) => {
    const email = req.body.email;
    const files = req.files;

    const documentData = {
      identification: {
        type: req.body["identification[type]"],
        file: files["identification[file]"]
          ? files["identification[file]"][0].filename
          : null,
      },
      birthCertificate: {
        type: req.body["birthCertificate[type]"],
        file: files["birthCertificate[file]"]
          ? files["birthCertificate[file]"][0].filename
          : null,
      },
      addressVerification: {
        type: req.body["addressVerification[type]"],
        file: files["addressVerification[file]"]
          ? files["addressVerification[file]"][0].filename
          : null,
      },
      educationalCredentials: {
        type: req.body["educationalCredentials[type]"],
        file: files["educationalCredentials[file]"]
          ? files["educationalCredentials[file]"][0].filename
          : null,
      },
      resume: files.resume ? files.resume[0].filename : null,
    };

    DocumentUploadModel.findOneAndUpdate({ email }, documentData, {
      upsert: true,
      new: true,
    })
      .then((result) => res.json(result))
      .catch((err) => {
        console.error("Documents Upload error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  }
);

// server/index.js



app.get('/api/workflow', async (req, res) => {
  try {
      const workflow = await WorkflowModel.findOne(); 
      if (workflow) {
          console.log("Fetched workflow:", workflow.order); // Log workflow
          res.json({ order: workflow.order }); 
      } else {
          console.log("No workflow found."); // Log missing workflow
          res.json({ order: [] }); 
      }
  } catch (error) {
      console.error('Error fetching workflow:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/workflow', async (req, res) => {
  const { order } = req.body;

  try {
    await WorkflowModel.findOneAndUpdate({}, { order }, { upsert: true });
    res.json({ status: 'Success' });
  } catch (err) {
    console.error('Error updating workflow:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/templates', async (req, res) => {
  try {
    const templates = await TemplateModel.find();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Select a template
app.post('/api/templates/select', async (req, res) => {
  const { templateId } = req.body;

  try {
    // Deselect all templates
    await TemplateModel.updateMany({}, { selected: false });

    // Select the chosen template
    await TemplateModel.findByIdAndUpdate(templateId, { selected: true });

    res.json({ status: 'Success' });
  } catch (error) {
    console.error('Error selecting template:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch the selected template (for UserAdmin)
app.get('/api/templates/selected', async (req, res) => {
  try {
    const selectedTemplate = await TemplateModel.findOne({ selected: true });
    res.json(selectedTemplate);
  } catch (error) {
    console.error('Error fetching selected template:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
