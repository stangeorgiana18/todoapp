import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Component } from "@angular/core";

interface Protein {
  proteinName: string;
  numberOfCharacters: number;
  proteinType: 0 | 1;
}

enum CatalyticType {
  NonCatalytic = "non_catalytic",
  Catalytic = "catalytic",
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  apiUrl = "https://rest.uniprot.org/uniprotkb/search";

  getProteinCaracteristics(fastaProteinList: string, proteinType: number) {
    return fastaProteinList
      .split(">sp")
      .slice(1)
      .map((protein) => {
        return {
          proteinName: protein.split("|")[1],
          numberOfCharacters: protein
            .split("\n")
            .slice(1, protein.length - 1)
            .reduce((acc, line) => (acc += line.length), 0),
          proteinType,
        };
      });
  }

  getProteinListOfType(proteinType: string) {
    let params = new HttpParams();
    params = params.append("format", "fasta");
    let id = "";
    let typeNr: number;
    let size = 10;

    if (proteinType === CatalyticType.NonCatalytic) {
      id = "9605";
      typeNr = 0;
    } else if (proteinType === CatalyticType.Catalytic) {
      id = "9606";
      typeNr = 1;
    }

    params = params.append("query", `((taxonomy_id:${id}))`);
    params = params.append("size", size);

    this.http
      .get(this.apiUrl, { params, responseType: "text" })
      .subscribe((res) =>
        console.log(
          proteinType + " ",
          this.getProteinCaracteristics(res, typeNr)
        )
      );
  }

  constructor(private http: HttpClient) {
    this.getProteinListOfType(CatalyticType.Catalytic);
    this.getProteinListOfType(CatalyticType.NonCatalytic);
  }
}
