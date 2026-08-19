import { Injectable } from '@angular/core';
import { BuilderStateService } from './builder-state.service';




@Injectable({
  providedIn: 'root'
})
export class BuilderFileService {


  constructor(
    private state: BuilderStateService
  ) {}






  exportTemplate():void {


    const template =
      this.state.template;



    if(!template)
      return;




    const json =
      JSON.stringify(
        template,
        null,
        2
      );




    const blob =
      new Blob(

        [json],

        {
          type:'application/json'
        }

      );




    const url =
      URL.createObjectURL(
        blob
      );




    const link =
      document.createElement('a');



    link.href =
      url;



    link.download =
      `${template.title}.json`;



    link.click();




    URL.revokeObjectURL(
      url
    );


  }








  importTemplate(
    file:File
  ):void {


    const reader =
      new FileReader();





    reader.onload = ()=>{


      try{


        const template =
          JSON.parse(
            reader.result as string
          );




        if(!template.questions){

          template.questions = [];

        }




        template.created_at =
          new Date(
            template.createdAt
          );



        template.updated_at =
          new Date(
            template.updatedAt
          );





        this.state.setTemplate(
          template
        );



        this.state.setSelectedQuestion(
          null
        );



      }
      catch(error){


        console.error(
          'Import JSON impossible',
          error
        );


      }


    };





    reader.readAsText(
      file
    );


  }



}