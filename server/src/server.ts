import app from "./app";
import { connectDatabase } from "./database/mongoDB";

const PORT = process.env.PORT || 3000;


app.listen(PORT, async() => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDatabase();
});
