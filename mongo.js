const mongoose = require('mongoose');
if(process.argv.length<3)
    {
        console.log("please enter mongo password as well");
        process.exit(1);
    }

const personSchema = new mongoose.Schema({
    "name":String,
    "number":String
});
const Person = mongoose.model('Person', personSchema)
const password = process.argv[2];
const url = `mongodb+srv://aman:${password}@cluster0.hlmjn8e.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false);
mongoose.connect(url);
if(process.argv.length == 3)
    {
        Person.find({}).then(result=>{
            console.log(result);
            mongoose.connection.close();
        })
    }

else{
    let name = process.argv[3];
    let number = process.argv[4];
    let obj = new Person({name:name,number:number,"singer":true})
    obj.save().then(result=>{
        console.log("phone record added");
        mongoose.connection.close();
    })
}