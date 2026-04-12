const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const urlSchema = new mongoose.Schema({ url: String });
const Url = mongoose.models.Url || mongoose.model("Url", urlSchema);

async function del() {
  await mongoose.connect(process.env.MONGO_URL);
  const url = "http://secure-login.bank-of-america-update.cc/auth/verify";
  const res = await Url.deleteOne({ url });
  if (res.deletedCount > 0) {
    console.log("Deleted URL:", url);
  } else {
    console.log("URL not found in database.");
  }
  process.exit(0);
}
del();
