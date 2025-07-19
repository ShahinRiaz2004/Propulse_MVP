require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
 const app = express();

require("./utils/backup.cron");


app.use(express.json());
app.use(cors());

//Connection to Database  

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB successfully Connected ✅"))
  .catch((err) => console.error(" Error Database Connection ❌ ", err));




//require Routes
const customerRoutes = require("./routes/customer.routes");
const transactionRoutes = require("./routes/transaction.routes");
const adminRoute = require("./routes/admin.routes");
const backupRoutes = require("./routes/backup.routes");
const daybookRoutes = require("./routes/daybook.routes");
const exchangesRoutes = require("./routes/exchanges.routes");
const treasuryRoutes = require("./routes/treasury.routes");

app.use("/api/user", customerRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/backup", backupRoutes);
app.use("/api/daybook", daybookRoutes);
app.use("/api/exchanges", exchangesRoutes);
app.use("/api/treasury", treasuryRoutes);


 
 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on pot 5000  `));
