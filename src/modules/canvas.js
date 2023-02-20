import {context,username as currentUser} from '../app.js';

export const draw = (e)=>{

  
    const {username, path, color, lineWidth} = JSON.parse(e.data);
    console.log(`${username} drawing`)

    if(currentUser == username){
        return;
    }

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    let firstPath = path[0];

    context.beginPath();
    context.moveTo(firstPath.x,firstPath.y);
    path.slice(1, path.length).map( path=>{
        context.lineTo(path.x ,path.y );
        context.stroke();
    })
}
