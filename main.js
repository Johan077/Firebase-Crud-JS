const db = firebase.firestore();

const task_form = document.querySelector('#task-form');
const task_cont = document.querySelector('#task-container');

let edit_status  =  false;
let id = '';

const save_task = (title, description) =>
    db.collection('tasks').doc().set({
        title,
        description
    })


    //Constantes Firebase 

    const get_task = () => db.collection('tasks').get();
    const get_ontask = (id) => db.collection('tasks').doc(id).get();
    const onGettask = (callback) => db.collection('tasks').onSnapshot(callback);
    const delet_task = id => db.collection('tasks').doc(id).delete();
    const update_task = (id, update_task) => db.collection('tasks').doc(id).update(update_task);
    

window.addEventListener('DOMContentLoaded', async (e) => {

    onGettask((querySnapshot) =>{
        task_cont.innerHTML = '';
        querySnapshot.forEach(doc => {

    
            const task = doc.data();
            task.id =doc.id;    
            task_cont.innerHTML += `<div class="card card-body mt-2 border-primary">
            <h5>${task.title}</h5>
            <p>${task.description}</p>
            <div>
                <button class="btn btn-primary btn-delete" data-id="${task.id}">borrar</button>
                <br> <br>
                <button class="btn btn-secondary btn-edit" data-id="${task.id}">editar</button>
            </div>
            </div>`;

            const btn_delete = document.querySelectorAll('.btn-delete');
            btn_delete.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    await delet_task(e.target.dataset.id);                  
                })
            })

            const btn_edit = document.querySelectorAll('.btn-edit');
            btn_edit.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    const doc = await get_ontask(e.target.dataset.id);   
                    const task = doc.data();

                    edit_status= true;
                    id = doc.id;

                    task_form['task-title'].value = task.title;                 
                    task_form['task-description'].value = task.description;                 
                })
            })

        })
    })   
})

task_form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const title = task_form['task-title'];
    const description = task_form['task-description'];

    if(!edit_status){
        await save_task(title.value, description.value);
    }else{
        await update_task(id,{
            title: title.value,
            description: description.value
        });
        edit_status= false;
        task_form['btn-task-form'].innerText =  'guardar';
    }

    await get_task();
    task_form.reset();

    title.focus();
})