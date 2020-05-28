/*
10.2  USB B connector communication

the byte stream uses the ASCII characters in the range 1..255 / 0x01..0xFF in hexadecimal

HEADER:
1 = "Start of Header" (<SOH>, 1,  0x01)
2 = counter (range "A" to "Z" overflow "Z" to "A")
3 = "N" => modelos HC30/60TS


BODY:
4 = "Start of Text" (<STX>, 2, 0x02)
5 até fim body = (range 32..126,  0x20..0xFF)
	"Horizontal  tab"  (<HT>  or  <TAB>,  9,  0x09),	if(line.substring(0, 1).equals("\t")){ }
	"Carriage  return"  (<CR>, 13,  0x0D),  			if(line.substring(0, 1).equals("\r")){ }
	"Line  feed"  (<LF>,  10,  0x0A)					if(line.substring(0, 1).equals("\n")){ }
body lines separated by a two-byte sequence <CR><LF>    if(line.substring(0, 1).equals("\r\n")){ } separador linha
body is closed by "End of Text" (<ETX>, 3, 0x03).


FOOTER:
checksum  two-digit hexadecimal summing values of all characters in the message header and body, including the beginning <SOT> and <ETX>, adding 255 (hex: 0xFF) to it, and keeping only the last two hexadecimal(!) digits
last character of a record "End of Transmission" (<EOT>, 4, 0x04)
The next record can start right after the <EOT> character



10.2.2   DETAILS OF THE 3.1 PROTOCOL

header1 to header 8 header1 to header8 are the lab header lines these lines are defined by the user in the instrument settings any or all of these lines can be empty
Serial No.:<HT>serial serial is the 6 digit serial number of the instrument
RecNo:<HT>recno  recno is the internal record number, at most 6 digits
Sample ID:<HT>sampleid sampleid is at most 8 characters long
Patient ID:<HT>patientid patientid is at most 20 characters long
Patient Name:<HT>patientname   patinetname is at most 32 characters long
Mode:<HT>mode  
Doctor:<HT>doctor doctor is at maximum 16 characters long
Age:<HT>value<HT>unit value is a number of at most 3 digits, unit is either "years" or "months" 
Birth(ymd):<HT>birthdate birthdate is an 8 digit number, format: yyyymmdd
Sex:<HT>gender gender is "Male", "Female", "Neutered", "Spayed" or a single "-" character
Test date(ymd):<HT>date date is an 8 digit number, format: yyyymmdd
Test time(hm):<HT>time time is a 6 digit number, format: hhmmss
Param<HT> Flags<HT> Value<HT>  Unit<HT>[min-max] this is a header line, always the same


param<HT>flag<HT>value<HT> unit<HT>[min-max] : 
There are 24 similar lines:
param is the parameter name, at most four characters long, 
possible values are (in sequence): WBC, RBC, HGB, HCT, MCV, 
MCH, MCHC, PLT, PCT, MPV, PDWs, PDWc, RDWs, RDWc, 
LYM, MON, NEU, LY%, MO%, NE%, EOS, EO%, BAS, BA%
flag is a single character indicator, can be " " (space), "+", "-", 
"E" and "*"(asterisk) value is the measured parameter value, 
exactly 4 characters: number with a possible decimal dot, 
padded with spaces on the left side, or 4 minus signs "----", 
or 4 spaces " " unit is at most 4 characters long, possible 
values are "10 9 /L", "10 3 / μ L", "10 12 /L", "10 6 /uL", "fL", "%", "g/L", "g/dL", "mmol/L", "pg", "fmol", depending on the 
parameter. Min and max are the lower and upper bounds of 
the normal range, exactly 4 characters, including a possible 
decimal dot, padded with spaces on the left side



Flags:<HT>flags flags is a series of characters indicating errors, at most 32 characters long, upper or lowercase letters "a" to "z"
WBC graph  always the same, indicates the beginning of the WBC histo-gram
Scale(fl):<HT>wbcscale  wbcscale is maximum 3 digit number, indicating the fl value of the last channel, value is usually 400
Channels:<HT>wbcchannels  wbcchannels is the number of channels (columns) in the histogram, always 256
WMarker1:<HT>wm1  wm1 is the first WBC discriminator channel (RBC/WBC)
WMarker2:<HT>wm2  wm2 is the second WBC discriminator channel (LYM/MON)
WMarker3:<HT>wm3  wm3 is the third WBC discriminator channel (MON/NEU)
Points:<HT>ch0<HT>...<HT>ch255 chxx is the histogram height at a given channel (range 0..255), there are always wbcchannels values here (usually256)
RBC graph always the same, indicates the beginning of the RBC histo-gram
Scale(fl):<HT>rbcscale  rbcscale is maximum 3 digit number, indicating the fl value of the last channel, value is usually 200
Channels:<HT>rbcchannels rbcchannels is the number of channels (columns) in the histogram, always 256
RMarker1:<HT>rm1  rm1 is the RBC discriminator channel (PLT/RBC)
Points:<HT>ch0<HT>...<HT>ch255 chxx is the histogram height at a given channel (range 0..255), there are always rbcchannels values here (usually256)
EOS graph always the same, indicates the beginning of the EOS histo-gram
Scale(fl):<HT>eosscale  eosscale is maximum 3 digit number, indicating the fl value of the last channel, value is usually 400
Channels:<HT>eoschannels  eoschannels is the number of channels (columns) in the histogram, always 256
EMarker1:<HT>em1  em1 is the EOS discriminator channel (WBC/EOS) 
Points:<HT>ch0<HT>...<HT>ch255 chxx is the histogram height at a given channel (range 0..255), there are always eoschannels values here (usually256)
PLT graph always the same, indicates the beginning of the PLT histo-gram
Scale(fl):<HT>pltscale pltscale is maximum 3 digit number, indicating the fl value of the last channel, value is usually 50
Channels:<HT>pltchannels pltchannels is the number of channels (columns) in the histogram, always 256
PMarker1:<HT>pm1 pm1 is the first PLT discriminator channel (PLT start)
PMarker2:<HT>pm2  pm2 is the second PLT discriminator channel (PLT/RBC)
Points:<HT>ch0<HT>...<HT>ch255 chxx is the histogram height at a given channel (range 0..255), there are always pltchannels values here usually 256)




Humacount30TS
short idVendor = 0x0403;
short idProduct = 0x6001;
Chip FT232R
http://www.ftdichip.com
*/




public class ProtocoloHumacount30TS {
	
	
	public void converterArquivo(String filePath) {
		
		//TODO VERIFICAR SE O ARQUIVO É ESSE LAYOTU
		try {
	
			List<List<String>> inputStreamData = readFile(filePath);
			
			/*
			//listar antes de processar
			for (int i = 0; i < inputStreamData.size(); i++) {
		    	System.out.println("================ REGISTRO " + i + " ===================");
		    	for (int j = 0; j < inputStreamData.get(i).size(); j++) {
		    		System.out.println("["+j+"]" + inputStreamData.get(i).get(j));
		    	}
		    }
			*/
			
		    
	
	    	//processar
	    	for (int i = 0; i < inputStreamData.size(); i++) {
		    	for (int j = 0; j < inputStreamData.get(i).size(); j++) {
		    		//antes
		    		//System.out.println("["+j+"]" + inputStreamData.get(i).get(j));
		    		inputStreamData.get(i).set(j, processaLinha(j, inputStreamData.get(i).get(j)) );
		    		//processado
		    		//System.out.println("["+j+"]" + inputStreamData.get(i).get(j));
		    	}
		    }
	
		    
		    
	        //sequencia da ordem das linhas no txt de saida
	    	//55 colunas
	    	//"RBC probe min", "RBC probe max", "WBC probe min", "WBC probe max", "Lisante" nao vem no arquivo por stream
	        int[] sequenciaProcessamento = {10, 18, 19, 11, 21, 28, 29, 30, 31, 32, 33, 36, 37, 38, 40, 39, 35, 34, 22, 23, 24, 25, 26, 27, 41, 42, 13, 43, 10, 10, 10, 10, 10};
	
	        //linha saida
	        String [] linhasTxt = new String[inputStreamData.size()+1];
	        
	        //header
	        String[] header = {"ID da amostra", "Data", "Tempo", "ID Paciente", "WBC", "WBC flags", "RBC", "RBC flags", "HGB", "HGB flags", "HCT", "HCT flags", "MCV", "MCV flags", "MCH", "MCH flags", "MCHC", "MCHC flags", "PLT", "PLT flags", "PCT", "PCT flags", "MPV", "MPV flags", "PDWs", "PDWs flags", "PDWc", "PDWc flags", "RDWs", "RDWs flags", "RDWc", "RDWc flags", "LYM", "LYM flags", "MON", "MON flags", "GRA", "GRA flags", "LYM%", "LYM% flags", "MON%", "MON% flags", "GRA%", "GRA% flags", "P-LCC", "P-LCC flags", "P-LCR", "P-LCR flags", "Tipo", "Atenção", "RBC probe min", "RBC probe max", "WBC probe min", "WBC probe max", "Lisante"};
	        linhasTxt[0] = "";
	        for (int i = 0; i < header.length; i++) {
	    		linhasTxt[0] += header[i] + "\t";
	    	}
	        
	        //junta em uma única linha os dados relevantes da linhas lidas no txt, separando cada um por tab 
		    for (int i = 0; i < inputStreamData.size(); i++) {
		    	linhasTxt[i+1] = "";
		    	for (int j = 0; j < sequenciaProcessamento.length; j++) {
		    		linhasTxt[i+1] += inputStreamData.get(i).get(sequenciaProcessamento[j]) + "\t";
		    	}
		    	//System.out.println(linhasTxt[i+1]);
		    }
	    

		    //FILES
	    	//renomear arquivo raw para tmp
	    	//String fileTempName = filePath.replace(".txt", "_tmp.txt");
	    	//File renamedFile = new File(fileTempName);
	    	//File fileRaw = new File(filePath);
	        //fileRaw.renameTo(renamedFile);

	    	//cria novo arquivo com linhas transformadas
	    	createFile(filePath.replace(".txt", "_transformado.txt"), linhasTxt);
	    	
	    	//deleta arquivo original raw
	    	//Files.deleteIfExists(Paths.get(fileTempName));
	    	
	    } catch (Exception ex) {
			ex.printStackTrace();
		}

	}
	
	
	
	public List<List<String>> readFile(String filename) {
		
		List<List<String>> listaRegistros = new ArrayList<List<String>>(); //guarda as linhas entre SOH -> EOT
		List<String> linhasRegistro = new ArrayList<String>(); //guarda as linhas entre STX -> ETX

		try ( BufferedReader reader = new BufferedReader(new FileReader(filename)); ) {
		    String linha;
		    
		    while ((linha = reader.readLine()) != null) {
		    	
		    	//procurar EOT separar cada registro
		    	if (linha.contains("\4")) {
		    		String[] splitLinha = linha.split("\4"); 
		    		
		    		//tratar cada EOT presente na linha
		    		for (int i = 0; i < splitLinha.length; i++) {
		    			linhasRegistro.add(splitLinha[i]);

		    			//o ultimo continua ate o proximo EOT que nao esta nessa linha
		    			//ressetar se tiver somente 1 elemento pois ele é o ultimo também
		    			if ((splitLinha.length == 1) ||  i != (splitLinha.length-1)) {
		    				if (linhasRegistro.size() > 1) { //adicionar somente registros relevantes mais de uma linha
		    					listaRegistros.add(linhasRegistro);
		    				}
		    				
		    				linhasRegistro = new ArrayList<String>(); //reset para linhas proximo registro depois do EOT
		    			}
		    		}
	    		
		    	} else {
		    		linhasRegistro.add(linha);
		    	}
		    	
		    	//linha.replace("\4", "") //EOT
		    	//linha.replace("\1", "") //SOH
		    	//linha.replace("\2", "") //STX
		    	//linha.replace("\3", "") //ETX
		    }
		    
		    reader.close();

		    return listaRegistros;

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	  
	}
	
	
	public void createFile(String filename, String[] content) {
		
		try (
			BufferedWriter writer = new BufferedWriter(
	        		new OutputStreamWriter(
	        			new FileOutputStream(filename), StandardCharsets.UTF_8) );
		) {

			for (int i = 0; i < content.length; i++) {
				writer.write(content[i]);
				writer.newLine();
		    }
	       	
        } catch (Exception e) { //IOException
        	e.printStackTrace();
    	}

		/*
		try {
			File file = new File(filename);

		   // if file doesnt exists, then create it
		   if (!file.exists()) {
		       file.createNewFile();
		   }
	
	       FileWriter fw = new FileWriter(file.getAbsoluteFile());
	       BufferedWriter bw = new BufferedWriter(fw);
	       
	       // write in file
	       for (int i = 0; i < content.length; i++) {
	    	   bw.write(content[i]);
	    	   bw.newLine();
	       }

		   // close connection
		   bw.close();
	     } catch(Exception e) {
	    	 System.out.println(e);
	     }
		*/
	}

	
	public String processaLinha(int indexLinha, String linhaTxt) {
		String retorno = "";
		String[] splitLinha;
		
		switch(indexLinha) {
			case 0 : // ENHumacount 30TS
				retorno = removerControlCodes(linhaTxt); 
			break;
			case 1 : // BIOsLABORATORIO
				retorno = removerControlCodes(linhaTxt); 
			break;
			case 2 : //branco
			case 3 : //branco
			case 4 : //branco
			case 5 : //branco
			case 6 : //branco
			case 7 : //branco
					retorno = " ";
				break;
			case 8 : //Serial No.:	821489
			case 9 : //RecNo:	2970
			case 10 : //Sample ID:	853
			case 11: //Patient ID:	853
			case 12: //Patient Name:	melissa
					retorno = separarLinha2Parametros(linhaTxt);
				break;
			case 13: //Mode:	Dog
					
					switch(separarLinha2Parametros(linhaTxt)) {
					case "Dog" :
							retorno = "Cão";
						break;
					case "Cat" :
							retorno = "Gato";
						break;
					case "Human" :
							retorno = "Humano";
						break;
					default:
							retorno = separarLinha2Parametros(linhaTxt);
					}

				break;
			case 14: //Doctor:	
					//splitLinha = linhaTxt.split("\t"); 
					//retorno = splitLinha[1].trim();
				break;
			case 15: //Age:	0	years
					splitLinha = linhaTxt.split(":"); 
					if(splitLinha.length == 2) {
						retorno = splitLinha[1].trim().replace("\t", " ");
					} else {
						retorno = linhaTxt.trim().replace("\t", " ");
					}
				break;
			case 16: //Birth(ymd):	00000000
					splitLinha = linhaTxt.split("\t"); 
					if(splitLinha.length >= 2) {
						retorno = splitLinha[1].substring(6, 8) + "/" + splitLinha[1].substring(4, 6) + "/" + splitLinha[1].substring(0, 4);
					} else {
						retorno = linhaTxt.trim().replace("\t", " ");
					}
				break;
			case 17 : //Sex:	Female
					retorno = separarLinha2Parametros(linhaTxt);
				break;
			case 18: //Test date(ymd):	20161213
					splitLinha = linhaTxt.split("\t"); 
					if(splitLinha.length >= 2) {
						retorno = splitLinha[1].substring(6, 8) + "/" + splitLinha[1].substring(4, 6) + "/" + splitLinha[1].substring(0, 4);
					} else {
						retorno = linhaTxt.trim().replace("\t", " ");
					}
				break;
			case 19: //Test time(hm):	182300
					splitLinha = linhaTxt.split("\t"); 
					if(splitLinha.length >= 2) {
						retorno = splitLinha[1].substring(0, 2) + ":" + splitLinha[1].substring(2, 4);
					} else {
						retorno = linhaTxt.trim().replace("\t", " ");
					}
				break;
			case 20: //Param	Flags	Value	Unit	[min-max]
					retorno = linhaTxt;
				break;
			case 21: //WBC	 	6.97	10^3/µl	[6.00-17.00]
			case 22: //LYM	 	3.16	10^3/µl	[1.00-4.80]
			case 23: //MON	-	0.17	10^3/µl	[0.20-1.50]
			case 24: //GRA	 	3.64	10^3/µl	[3.00-12.00]
			case 25: //LY%	+	45.4	%	[12.0-30.0]
			case 26: //MO%	 	 2.5	%	[ 2.0- 4.0]
			case 27: //GR%	-	52.2	%	[62.0-87.0]
			case 28: //RBC	 	6.95	10^6/µl	[5.50-8.50]
			case 29: //HGB	 	16.2	g/dl	[12.0-18.0]
			case 30 : //HCT	+	57.40	%	[37.00-55.00]
			case 31: //MCV	+	  83	fl	[  60-  77]
			case 32: //MCH	 	23.2	pg	[19.5-24.5]
			case 33: //MCHC	-	28.1	g/dl	[31.0-34.0]
			case 34: //RDWc	 	13.1	%	[ 0.0- 0.0]
			case 35: //RDWs	 	51.6	fl	[ 0.0- 0.0]
			case 36: //PLT	+	 558	10^3/µl	[ 200- 500]
			case 37: //PCT	 	0.64	%	[0.00-0.00]
			case 38: //MPV	+	11.5	fl	[ 3.9-11.1]
			case 39: //PDWc	 	37.9	%	[ 0.0- 0.0]
			case 40 : //PDWs	 	15.2	fl	[ 0.0- 0.0]
			case 41: //PLCC	 	 223	10^3/µl	[   0-   0]
			case 42: //PLCR	 	55.89	%	[0.00-0.00]
				splitLinha = linhaTxt.split("\t"); //[0] = nome parametro [1] = flag [2] = valor
				if(splitLinha.length >= 3)
					retorno = splitLinha[2].trim() + "\t" + splitLinha[1].trim(); 
				break;
			case 43 : //Flags:	
				
				break;
			default: 
					retorno = linhaTxt;
		}
		
		return retorno;
    }
	
	
	private String separarLinha2Parametros(String linha) {
		String retorno = "";
		String[] splitLinha = linha.split("\t");
		
		if(splitLinha.length == 2) {
			retorno = splitLinha[1].trim();
		} else {
			retorno = linha.replace("\t", " ").trim();
		}
		
		return retorno;
	}
	
	private String removerControlCodes(String txt){
		txt.replace("\4", ""); //EOT
		txt.replace("\1", ""); //SOH
		txt.replace("\2", ""); //STX
		txt.replace("\3", ""); //ETX
		return txt;
	}

	
	

}
