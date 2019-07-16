import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    
  })
};


@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipesApiUrl = 'http://localhost:3000/';  // URL
  constructor(private http: HttpClient) { 

  }

  getAllCategories()
  {
      return this.http.get(this.recipesApiUrl+"categories");
  }

  getRecipesByCategoryId(id : number)
  {
    return this.http.get(this.recipesApiUrl+"recipes?category_id="+id);
  }

  getRecipeById(id : number)
  {
    return this.http.get(this.recipesApiUrl+"recipes?id="+id);
  }

  postNewRecipe(data)
  {
    return this.http.post(this.recipesApiUrl+"recipes",data);
  }

  deleteRecipeById(id)
  {
    return this.http.delete(this.recipesApiUrl+"recipes/"+id);
  }

  patchRecipe(data)
  {
    return this.http.patch(this.recipesApiUrl+"recipes/"+data.id,data)
  }

}
