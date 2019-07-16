import { Component, OnInit } from '@angular/core';
import { RecipeService } from './recipe.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  opened: boolean;

  //Holds all categories
  categories : any;

  //Filter Text
  searchText;

  //Current Recipe List based on Category will need to be updated 
  //by Calling Get Recipes By Category Id
  currentRecipeList: any;


  //Toggle More Info vs All Recipies in Category
  showMultipleRecipes : boolean;

  //Holds Data for Edit Dialog 
  editRecipe : any;
  
  //String placeholder for Category during Edit
  editCurrentCategory : any;

  //Displays current recipe when clicking info button
  currentRecipe : any;

  //FormGroup containing data structure
  form: FormGroup;

  //Dialog Ref for every dialog
  dialogRef;

  constructor(private recipeService : RecipeService, private fb: FormBuilder ,public dialog: MatDialog) 
  { 

    this.showMultipleRecipes = true;

    this.form = fb.group({
      id : [""],
      title: ["", Validators.required],
      recipe: ["", Validators.required],
      category_id: ["", Validators.required],
  });
    
  }

  toggleSideNav()
  {
    this.opened = this.opened == true ? false : true;
  }
  ngOnInit() 
  {
      this.recipeService.getAllCategories().subscribe(
        (res) => {
          this.categories = res;
          console.log(res);
        },
        (err) =>{
          console.log(err);
        },
        () =>{
          console.log("complete");
        }
      );
      this.recipeService.getRecipesByCategoryId(1).subscribe(
        (res) => {
          this.currentRecipeList = res;
          console.log(res);
        },
        (err) =>{
          console.log(err);
        },
        () =>{
          console.log("complete");
        }
        );


  }

  recipesByCategoryId(id : number)
  {
    this.showMultipleRecipes = true;
    this.recipeService.getRecipesByCategoryId(id).subscribe(
      (res) => {
        this.currentRecipeList = res;
        console.log(res);
      },
      (err) =>{
        console.log(err);
      },
      () =>{
        console.log("complete");
      }
    )
  }

  postNewRecipe()
  {
   
    if(this.form.valid){
    this.recipeService.postNewRecipe(this.form.value).subscribe(
      (res)=>{
        console.log(res);
      },
      (err)=>
      {
        console.log(err);
      },
      ()=>{
        console.log("Complete")
        this.updateList();
        this.dialogRef.close();
      }
    )
    
    
    }
  }

  diagnosticEdit(){
    return JSON.stringify(this.editRecipe);
  }


  addDialog(templateRef): void {
    
    this.form = this.fb.group({
      id : [""],
      title: ["", Validators.required],
      recipe: ["", Validators.required],
      category_id: ["", Validators.required],

  });

    this.dialogRef = this.dialog.open(templateRef, {
      width: '250px'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });
  }


  updateList()
  {
    this.recipeService.getRecipesByCategoryId(this.form.value.category_id).subscribe(
      (res)=>{
        this.currentRecipeList = res;
      },
      (err)=>{

      },
      ()=>{

      }
    )

  }
  patchRecipe()
  {
    if(this.form.valid){
      this.recipeService.patchRecipe(this.form.value).subscribe(
        (res)=>{
          console.log(res);
         
        },
        (err)=>
        {
          console.log(err);
        },
        ()=>{
          console.log("Complete")
          this.updateList();
          this.dialogRef.close();
        }
      )
      
      
      }

  }

  //For Placehold Text while editing
  getEditRecipeCategory( id )
  {
    return this.categories.filter((e)=>(e.id == id))[0].title;
  }

  //Call made to recipe service could have done this in a batch like the categories
  editDialog(templateRef,id): void {
    
    this.recipeService.getRecipeById(id).subscribe(
      (res)=>{

        //Placeholder mess maybe theres a better way
        this.editRecipe = res[0];
        this.editCurrentCategory = this.getEditRecipeCategory(this.editRecipe.category_id);
        //

        this.form = this.fb.group({
          id : [this.editRecipe.id],
          title: [this.editRecipe.title, Validators.required],
          recipe: [this.editRecipe.recipe, Validators.required],
          category_id: [this.editRecipe.category_id, Validators.required],
      });
        
      },
      (err)=>{

      },
      ()=>{

        this.dialogRef = this.dialog.open(templateRef, {
          width: '250px'
        });
    
        this.dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');


          
        });

      });

  }

  deleteRecipeById(id) {
    this.recipeService.deleteRecipeById(id).subscribe(
      (res)=>{
        console.log(res);
      },
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.updateList();
        this.dialogRef.close();
        console.log("Complete");
      }
    )
  }

  deleteDialog(templateRef, id ): void {
    this.recipeService.getRecipeById(id).subscribe(
      (res)=>{

        //Placeholder mess maybe theres a better way
        this.editRecipe = res[0];
        this.editCurrentCategory = this.getEditRecipeCategory(this.editRecipe.category_id);
        //

        this.form = this.fb.group({
          id : [this.editRecipe.id],
          title: [this.editRecipe.title, Validators.required],
          recipe: [this.editRecipe.recipe, Validators.required],
          category_id: [this.editRecipe.category_id, Validators.required],
      });
        
      },
      (err)=>{

      },
      ()=>{

        this.dialogRef = this.dialog.open(templateRef, {
          width: '250px'
        });
    
        this.dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');


          
        });

      });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  getRecipeById(id : number)
  {
    
    this.recipeService.getRecipeById(id).subscribe(
      (res) => {
        this.currentRecipe = res[0];
        console.log(res);
        this.showMultipleRecipes = false;
      },
      (err) =>{
        console.log(err);
      },
      () =>{
        console.log("complete");
      }
    )
  }

}
