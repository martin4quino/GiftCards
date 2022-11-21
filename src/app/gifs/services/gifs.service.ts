import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '6kRNOnAAZfXGGCuaUnXuKWBbx5AjCVi2';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient) {

    //Local Storage: con getItem vemos lo que hay almacenado en local storage
    // Si hay en el localstorage una variable con valor parseamos la información y la asignamos a this._historial
    // Al final se le agrega ! , dado que espera siempre un string y puede devolver un null, es como decir hacelo igual ya que hicimos el if validador
    
    // if(localStorage.getItem('historial')){
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }

    //Tambien se puede hacer en una sola linea: si regresa null retorna un arreglo vacio
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

  }

  buscarGifs( query: string){

    //Al query que viene como parametro le saca espacios adelante y atrás con trim y lo transforma a minusculas
    query = query.trim().toLowerCase();

    //Si lo que viene en Query no existe en el listado lo agrega
    if(!this._historial.includes( query )){
      
        // Con el siguiente proceso insertamos el valor
        this._historial.unshift( query );

        // Esta funcionalidad hace que no se pueda insertar más de 10 valores
        this._historial = this._historial.splice(0, 10);

        // Guardamos el historial en el LOCAL STORAGE, setItem espera el nombre y un string. 
        // Utirlizamos JSON.stringify() para transformar un objeto en string
        localStorage.setItem('historial', JSON.stringify(this._historial));

    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query);

          console.log(params.toString());

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
          .subscribe( (resp) => {
            console.log(resp.data);
            this.resultados = resp.data;
            localStorage.setItem('resultados', JSON.stringify(this.resultados));
          } )
  }
  
}
