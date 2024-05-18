const express = require('express')
const path = require('path');
const app = express()
const port = 3000



// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/banner', express.static(path.join(__dirname, '../Banner')));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'MainP.html'));
  });

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})