import formidable from "formidable";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const config = {
  api: {
    bodyParser: false
  }
};

    const post = async (req, res) => {
        const form = new formidable.IncomingForm();
        let fNameWithExt = uuidv4();

        form.parse(req, async function (err, fields, files) {
            fNameWithExt = fNameWithExt+path.extname(files.file.name);
            await saveFile(files.file,fNameWithExt);
            res.json({success:true,'file':fNameWithExt});
        });
      };
      
      const saveFile = async (file,name) => {
        const data = fs.readFileSync(file.path);
        fs.writeFileSync(`./public/uploads/${name}`, data);
        await fs.unlinkSync(file.path);
    };

    export default async function handle(req, res) {

        switch (req.method) {
            case "POST":
                await post(req, res);

                break;
        
            default:
                break;
        }
      }

