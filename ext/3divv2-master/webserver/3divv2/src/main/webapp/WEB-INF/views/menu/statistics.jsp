<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page buffer="16kb" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="../common/header.jsp" flush="false"/>

<!-- <link href="//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<script src="//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script> -->

<script>
	$(document).ready(function(){
		$(".nav-menu > ul > li").removeClass("active");
		$("#nav-statistics").addClass("active");
	})
</script>

<style>
	.table thead th { vertical-align: middle !important; text-align: center !important;}
	.table tbody tr td { vertical-align: middle; }
</style>

	<section id="subhero" class="d-flex align-items-center">
		<div class="container position-relative">
			<div class="row justify-content-center">
				<div class="col-xl-7 col-lg-9 text-center">
					<h1>STATISTICS</h1>
				</div>
			</div>
		</div>
	</section>
	
	<main id="main">
		<section id="statistics" class="statistics statisticspage">
			<div class="container" data-aos="fade-up">
				<div class="panel with-nav-tabs panel-info">
	                <div class="panel-heading">
						<ul class="nav nav-tabs">
							<li class="nav-item">
								<a class="nav-link active" data-toggle="tab" href="#hic">Hi-C</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#capturehic">Capture Hi-C</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#cancerhic">Cancer Hi-C</a>
							</li>
						</ul>
					</div>
				
					<div class="panel-body">
						<div class="tab-content">
							<div class="pt-5 table-responsive tab-pane fade in show active" id="hic">
<table class='table table-sm table-bordered text-center' style='border-top:2px solid #777777; line-height:28px;'><thead class='table-secondary' style='font-size:13px; border:0;'><tr><td style='vertical-align: middle;'>Sample & Description</td><td style='vertical-align: middle;'>GEO Ids</td><td style='vertical-align: middle;'>Raw read counts</td><td style='vertical-align: middle;'>Properly aligned reads</td><td style='vertical-align: middle;'>Valid interaction reads</td><td style='vertical-align: middle;'>Reference genome
</td></tr></thead><tbody style='font-size:11px;'><tr><td>MCF10 cell line (ER-/PR- fibrocystic disease)</td><td>GSM3417098</td><td>180886069</td><td>125678611</td><td>49228102</td><td>hg38
</td></tr><tr><td>BT474 cell line (ER+/PR+ breast cancer cell line)</td><td>GSM3417102</td><td>146737812</td><td>104612109</td><td>50144320</td><td>hg38
</td></tr><tr><td>SKBR3 cell line (ER-/PR- adenocarcinoma)</td><td>GSM3417109</td><td>173361122</td><td>121286602</td><td>48871904</td><td>hg38
</td></tr><tr><td>Embryonic stem cell, Cardiomyocyte differentiation : hESCs (day 0)</td><td>GSM3262956, GSM3262957</td><td>3065443051</td><td>2320491192</td><td>1285311235</td><td>hg38
</td></tr><tr><td>Embryonic stem cell, Cardiomyocyte differentiation : cardiac progenitors (day 7)</td><td>GSM3262962, GSM3262963</td><td>2633149645</td><td>1989587840</td><td>1184379812</td><td>hg38
</td></tr><tr><td>Embryonic stem cell, Cardiomyocyte differentiation : primitive cardiomyocytes (day 15)</td><td>GSM3262964, GSM3262965</td><td>2645997225</td><td>2010669887</td><td>1113062173</td><td>hg38
</td></tr><tr><td>Embryonic stem cell, Cardiomyocyte differentiation : ventricular cardiomyocytes (day 80)</td><td>GSM3262966, GSM3262967</td><td>2791360542</td><td>2107678616</td><td>1186372639</td><td>hg38
</td></tr><tr><td>Embryonic stem cell</td><td>GSM3263085, GSM3263086</td><td>552532207</td><td>423393820</td><td>306106105</td><td>hg38
</td></tr><tr><td>Embryonic stem cell, HERV-H1 Knock-Out, HERV-H elements located TAD boundaries were deleted using CRISPR?Cas9</td><td>GSM3263087, GSM3263088</td><td>606526176</td><td>464991357</td><td>335198946</td><td>hg38
</td></tr><tr><td>Embryonic stem cell, HERV-H2 Knock-Out, HERV-H elements located TAD boundaries were deleted using CRISPR?Cas9</td><td>GSM3263089, GSM3263090</td><td>635909624</td><td>488199946</td><td>350004302</td><td>hg38
</td></tr><tr><td>Embryonic stem cell, HERV-H1 CRISPRi</td><td>GSM3734950, GSM3734951</td><td>264104080</td><td>177046213</td><td>145540552</td><td>hg38
</td></tr><tr><td>Embryonic stem cell, HERV-H2 CRISPRi</td><td>GSM3734952, GSM3734953</td><td>278214140</td><td>188031209</td><td>156571323</td><td>hg38
</td></tr><tr><td>Embryonic stem cell, HERV-H2-insertion clone1</td><td>GSM3734958, GSM3734959</td><td>551761465</td><td>413295286</td><td>305877518</td><td>hg38
</td></tr><tr><td>Embryonic stem cell, HERV-H2-insertion clone2</td><td>GSM3734960, GSM3734961</td><td>555274478</td><td>418410249</td><td>302808720</td><td>hg38
</td></tr><tr><td>teloHAEC (endothelial cell line)</td><td>GSM3593256, GSM3593257</td><td>1588475317</td><td>1083869648</td><td>597523217</td><td>hg38
</td></tr><tr><td>teloHAEC (endothelial cell line), TNF_ treated, 4hour</td><td>GSM3593258, GSM3593259</td><td>1672074029</td><td>1139419192</td><td>616723577</td><td>hg38
</td></tr><tr><td>primary white blood cell</td><td>GSM3560407, GSM3560408</td><td>1001632098</td><td>579240864</td><td>279320427</td><td>hg38
</td></tr><tr><td>primary neutrophil cell</td><td>GSM3560409</td><td>1964564641</td><td>1126798770</td><td>501305176</td><td>hg38
</td></tr><tr><td>HEK293T (embryonic kidney cell line), transfected with dCas9-VPR targeting the promoter CTCF binding site of Pcdha12</td><td>GSM3514558, GSM3514559, GSM3514560</td><td>236032876</td><td>160913387</td><td>29305790</td><td>hg38
</td></tr><tr><td>HEK293T (embryonic kidney cell line), transfected with dCas9-VPR targeting the exon CTCF binding site of Pcdha12</td><td>GSM3514561, GSM3514562, GSM3514563</td><td>230383638</td><td>144313932</td><td>26813179</td><td>hg38
</td></tr><tr><td>HUVEC (umblical vein endothelial cells)</td><td>GSM3438650, GSM3438651</td><td>360069151</td><td>273451397</td><td>146408594</td><td>hg38
</td></tr><tr><td>HUVEC (umblical vein endothelial cells), treated 10 ng/ml TNF-_, 1hour</td><td>GSM3438652, GSM3438653</td><td>361675769</td><td>277047686</td><td>151574445</td><td>hg38
</td></tr><tr><td>Peripheral blood neutrophils</td><td>GSM3612251, GSM3612252, GSM3612253</td><td>129246286</td><td>83754016</td><td>32206699</td><td>hg38
</td></tr><tr><td>Peripheral blood neutrophils, treat 25nM PMA, 3hour</td><td>GSM3612254, GSM3612255, GSM3612256</td><td>391792697</td><td>288684798</td><td>211578071</td><td>hg38
</td></tr><tr><td>Peripheral blood neutrophils, co-cultured with E.coli K1, 3hour</td><td>GSM3612257, GSM3612258</td><td>93175470</td><td>62043548</td><td>19997046</td><td>hg38
</td></tr><tr><td>ASCs (Adipose-Derived Stem Cells), 0 day of differentiation induction</td><td>GSM2973922, GSM2973923</td><td>461114318</td><td>338818537</td><td>90312681</td><td>hg38
</td></tr><tr><td>ASCs (Adipose-Derived Stem Cells), 1 day of differentiation induction</td><td>GSM2973924, GSM2973925</td><td>557681835</td><td>450140489</td><td>120917711</td><td>hg38
</td></tr><tr><td>ASCs (Adipose-Derived Stem Cells), 3 day of differentiation induction</td><td>GSM3394773, GSM3394727</td><td>798642489</td><td>243984719</td><td>43488065</td><td>hg38
</td></tr><tr><td>ASCs (Adipose-Derived Stem Cells), 2 days before induction of differentiation</td><td>GSM2973928, GSM2973929</td><td>447238034</td><td>344442038</td><td>154678155</td><td>hg38
</td></tr><tr><td>ASCs (Adipose-Derived Stem Cells), 1 day after neuronal induction</td><td>GSM2973930, GSM2973931</td><td>1024063415</td><td>765566655</td><td>69276217</td><td>hg38
</td></tr><tr><td>ASCs (Adipose-Derived Stem Cells), 3 day after neuronal induction</td><td>GSM2973932, GSM2973933</td><td>841217186</td><td>538711679</td><td>136250162</td><td>hg38
</td></tr><tr><td>Na•ve human embryonic stem cells, growth condition: GSKi + MEKi (2i), Lif, IGF1, FGF</td><td>GSM2410309, GSM2410310</td><td>1569027977</td><td>1098155835</td><td>610379770</td><td>hg38
</td></tr><tr><td>ADAC418 (primary islet)</td><td>GSM3333898</td><td>3113210373</td><td>2312969803</td><td>818402658</td><td>hg38
</td></tr><tr><td>EndoC-_H1 cells (pancreatic beta cell line)</td><td>GSM3333916</td><td>2979448695</td><td>2166636763</td><td>710726913</td><td>hg38
</td></tr><tr><td>GM23248 (primary skin fibroblasts)</td><td>GSM3506961, GSM3506962, GSM3506963, GSM3506964, GSM3506965, <br>GSM3506966, GSM3506967, GSM3506968, GSM3506969, GSM3506970</td><td>2339174554</td><td>1622776059</td><td>678483853</td><td>hg38
</td></tr><tr><td>HTBE (human tracheobronchial epithelial cells), infect active H5N1 influenza, infection time 12hour</td><td>GSM3112369, GSM3112370</td><td>379673223</td><td>274630670</td><td>150818035</td><td>hg38
</td></tr><tr><td>HTBE (human tracheobronchial epithelial cells), infect UV-inactived H5N1 influenza, infection time 12hour</td><td>GSM3112371, GSM3112372</td><td>362519567</td><td>263386426</td><td>136370297</td><td>hg38
</td></tr><tr><td>HTBE (human tracheobronchial epithelial cells), infect mock, infection time 12hour</td><td>GSM3112373, GSM3112374</td><td>366038580</td><td>263501503</td><td>137266211</td><td>hg38
</td></tr><tr><td>HTBE (human tracheobronchial epithelial cells), infect active H5N1 influenza, infection time 18hour</td><td>GSM3112375, GSM3112376</td><td>375805175</td><td>274612117</td><td>156023009</td><td>hg38
</td></tr><tr><td>HTBE (human tracheobronchial epithelial cells), infect UV-inactived H5N1 influenza, infection time 18hour</td><td>GSM3112377, GSM3112378</td><td>389553610</td><td>286177447</td><td>154089580</td><td>hg38
</td></tr><tr><td>HTBE (human tracheobronchial epithelial cells), infect mock, infection time 18hour</td><td>GSM3112379, GSM3112380</td><td>377989499</td><td>272732142</td><td>143348203</td><td>hg38
</td></tr><tr><td>HTBE (human tracheobronchial epithelial cells), infect active H5N1 influenza, infection time 6hour</td><td>GSM3112381, GSM3112382</td><td>259797113</td><td>190293754</td><td>103982906</td><td>hg38
</td></tr><tr><td>HTBE (human tracheobronchial epithelial cells), infect UV-inactived H5N1 influenza, infection time 6hour</td><td>GSM3112383, GSM3112384</td><td>373113215</td><td>273668222</td><td>147941389</td><td>hg38
</td></tr><tr><td>HTBE (human tracheobronchial epithelial cells), infect mock, infection time 6hour</td><td>GSM3112385, GSM3112386</td><td>393316499</td><td>284747076</td><td>151571589</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), infect active H5N1 influenza, infection time 12hour</td><td>GSM3112387, GSM3112388</td><td>374094480</td><td>271393455</td><td>116486007</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), infect UV-inactived H5N1 influenza, infection time 12hour</td><td>GSM3112389, GSM3112390</td><td>370873730</td><td>271139299</td><td>141891144</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), infect mock, infection time 12hour</td><td>GSM3112391, GSM3112392</td><td>375325186</td><td>269603223</td><td>141590565</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), infect active H5N1 influenza, infection time 18hour</td><td>GSM3112393, GSM3112394</td><td>342546315</td><td>246710535</td><td>90107030</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), infect UV-inactived H5N1 influenza, infection time 18hour</td><td>GSM3112395, GSM3112396</td><td>359582741</td><td>263009661</td><td>126662575</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), infect mock, infection time 18hour</td><td>GSM3112397, GSM3112398</td><td>241494923</td><td>176023629</td><td>82834015</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), infect active H5N1 influenza, infection time 6hour</td><td>GSM3112399, GSM3112400, GSM3111878, GSM3111879</td><td>1348816197</td><td>775193565</td><td>341289090</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), infect UV-inactived H5N1 influenza, infection time 6hour</td><td>GSM3112401, GSM3112402</td><td>372341299</td><td>273495677</td><td>142104639</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), infect mock, infection time 6hour</td><td>GSM3112403, GSM3112404, GSM3111876, GSM3111877</td><td>1561401808</td><td>891443631</td><td>356578081</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), infect H5N1-dNS1 influenza, infection time 6hour</td><td>GSM3111880, GSM3111881</td><td>1081954822</td><td>553987309</td><td>231746456</td><td>hg38
</td></tr><tr><td>MDM (monocyte-derived macrophages), treat IFNb, 6hour</td><td>GSM3111882, GSM3111883</td><td>955245255</td><td>487116744</td><td>199473555</td><td>hg38
</td></tr><tr><td>H9 Human Embryonic Stem Cells</td><td>GSM2309023</td><td>312782126</td><td>899156350</td><td>181919119</td><td>hg38
</td></tr><tr><td>H9 human Embryonic Stem Cell Line, Heat shock condition</td><td>GSM2816609, GSM2816610</td><td>601967908</td><td>407959808</td><td>166471296</td><td>hg38
</td></tr><tr><td>CD4+ T cells</td><td>GSM2627271, GSM2627272</td><td>205038316</td><td>147441811</td><td>30284233</td><td>hg38
</td></tr><tr><td>CD4+ T cells, activated using anti-CD3/CD28 bead</td><td>GSM2627273, GSM2627274</td><td>186038886</td><td>134000180</td><td>28683992</td><td>hg38
</td></tr><tr><td>Na•ve CD4+ T cells</td><td>GSM2827786</td><td>225299757</td><td>170250110</td><td>81075757</td><td>hg38
</td></tr><tr><td>Na•ve CD4+ T cells</td><td>GSM2827787</td><td>258000998</td><td>195680987</td><td>94280663</td><td>hg38
</td></tr><tr><td>Na•ve CD8+ T cells</td><td>GSM2827788</td><td>246951691</td><td>184257317</td><td>81669241</td><td>hg38
</td></tr><tr><td>Na•ve CD8+ T cells</td><td>GSM2827789</td><td>224469689</td><td>169061948</td><td>81681918</td><td>hg38
</td></tr><tr><td>B cells</td><td>GSM2827790</td><td>280648411</td><td>212305488</td><td>103487984</td><td>hg38
</td></tr><tr><td>B cells</td><td>GSM2827791</td><td>280520979</td><td>212230981</td><td>99240188</td><td>hg38
</td></tr><tr><td>MCF10a (epithelial cell line), arrested in G1</td><td>GSM3110157, GSM3110158</td><td>475958430</td><td>347978572</td><td>125736168</td><td>hg38
</td></tr><tr><td>MCF10a (epithelial cell line), arrested in G1 and transfected STAG1 siRNA</td><td>GSM3110159, GSM3110160</td><td>488301184</td><td>358347580</td><td>119713846</td><td>hg38
</td></tr><tr><td>MCF10a (epithelial cell line), arrested in G1 and transfected STAG2 siRNA</td><td>GSM3110161, GSM3110162</td><td>472317730</td><td>346416380</td><td>136441940</td><td>hg38
</td></tr><tr><td>HUVEC (Human umbilical vein endothelial cells), donor1</td><td>GSM2595581</td><td>382431967</td><td>275209240</td><td>110971928</td><td>hg38
</td></tr><tr><td>HUVEC (Human umbilical vein endothelial cells), donor2</td><td>GSM2595582</td><td>331260858</td><td>210749215</td><td>66957102</td><td>hg38
</td></tr><tr><td>HUVEC (Human umbilical vein endothelial cells), donor3</td><td>GSM2595583</td><td>361226844</td><td>257490619</td><td>100597411</td><td>hg38
</td></tr><tr><td>IMR90 (fetal lung fibroblast cell), I10</td><td>GSM2595584</td><td>324791121</td><td>255433027</td><td>72976466</td><td>hg38
</td></tr><tr><td>IMR90 (fetal lung fibroblast cell), I79</td><td>GSM2595585</td><td>309340828</td><td>237394131</td><td>82507957</td><td>hg38
</td></tr><tr><td>MSC (mesenchymal stromal cells)</td><td>GSM2595586</td><td>290778132</td><td>219336213</td><td>60801048</td><td>hg38
</td></tr><tr><td>HUVEC (Human umbilical vein endothelial cells), donor1, Oncogenic induced senescence</td><td>GSM2595587</td><td>433798275</td><td>308073201</td><td>136048369</td><td>hg38
</td></tr><tr><td>HUVEC (Human umbilical vein endothelial cells), donor2, Oncogenic induced senescence</td><td>GSM2595588</td><td>383019681</td><td>267693856</td><td>111074334</td><td>hg38
</td></tr><tr><td>HUVEC (Human umbilical vein endothelial cells), donor3, Oncogenic induced senescence</td><td>GSM2595589</td><td>353787843</td><td>190664695</td><td>37073623</td><td>hg38
</td></tr><tr><td>IMR90 (fetal lung fibroblast cell), I10, Oncogenic induced senescence</td><td>GSM2595590</td><td>365955873</td><td>295966938</td><td>63701043</td><td>hg38
</td></tr><tr><td>IMR90 (fetal lung fibroblast cell), I79, Oncogenic induced senescence</td><td>GSM2595591</td><td>339556076</td><td>270791941</td><td>69413884</td><td>hg38
</td></tr><tr><td>MSC (mesenchymal stromal cells), Oncogenic induced senescence</td><td>GSM2595592</td><td>343421137</td><td>266207803</td><td>83357956</td><td>hg38
</td></tr><tr><td>HUVEC (Human umbilical vein endothelial cells), donor2, Oncogenic induced senescence, treated with non-targeting control siRNA</td><td>GSM2595593</td><td>396417611</td><td>300552846</td><td>16733122</td><td>hg38
</td></tr><tr><td>HUVEC (Human umbilical vein endothelial cells), treated with siRNA targeting HMGB2 (HMGB2-Knock Down)</td><td>GSM2595594</td><td>391426694</td><td>295180178</td><td>11950450</td><td>hg38
</td></tr><tr><td>RUES2 (Embryonic stem cells), cardiac differentiation stage : Embryonic stem cells (ESC)</td><td>GSM2845448, GSM2845449</td><td>326879905</td><td>247467014</td><td>83742737</td><td>hg38
</td></tr><tr><td>RUES2 (Embryonic stem cells), cardiac differentiation stage : mesoderm (MES)</td><td>GSM2845450, GSM2845451</td><td>250149093</td><td>185768617</td><td>46113431</td><td>hg38
</td></tr><tr><td>RUES2 (Embryonic stem cells), cardiac differentiation stage : cardiac progenitor (CP)</td><td>GSM2845452, GSM2845453</td><td>417731285</td><td>310190639</td><td>75138096</td><td>hg38
</td></tr><tr><td>RUES2 (Embryonic stem cells), cardiac differentiation stage : cardiomyocytes (CM)</td><td>GSM2845454, GSM2845455</td><td>493922549</td><td>359613601</td><td>61699109</td><td>hg38
</td></tr><tr><td>RUES2 (Embryonic stem cells), fetal heart</td><td>GSM2845456, GSM2845457</td><td>489337787</td><td>321352628</td><td>76808476</td><td>hg38
</td></tr><tr><td>WTC-11 (iPSCs), cardiac differentiation stage : pluripotent stem cells (PSC)</td><td>GSM3452717, GSM3452718</td><td>335467550</td><td>229202223</td><td>80251558</td><td>hg38
</td></tr><tr><td>WTC-11 (iPSCs), cardiac differentiation stage : mesoderm (MES)</td><td>GSM3452719, GSM3452720</td><td>241992194</td><td>161431233</td><td>52950578</td><td>hg38
</td></tr><tr><td>WTC-11 (iPSCs), cardiac differentiation stage : cardiac progenitor (CP)</td><td>GSM3452721, GSM3452722</td><td>282305701</td><td>171074002</td><td>42892118</td><td>hg38
</td></tr><tr><td>WTC-11 (iPSCs), cardiac differentiation stage : cardiomyocytes (CM)</td><td>GSM3452723, GSM3452724</td><td>359576166</td><td>237788540</td><td>59839164</td><td>hg38
</td></tr><tr><td>Human Hematopoietic Stem/Progenitor Cells (CD34+, CD38-)</td><td>GSM2861708</td><td>1125460828</td><td>725985897</td><td>216969402</td><td>hg38
</td></tr><tr><td>Human T cell (CD3+)</td><td>GSM2861709</td><td>965167644</td><td>702532124</td><td>94189553</td><td>hg38
</td></tr><tr><td>Human Erythroid Progenitor cells (CD36+, CD71+, CD235a+)</td><td>GSM2861710</td><td>1377731051</td><td>1000420229</td><td>282268773</td><td>hg38
</td></tr><tr><td>RWPE1 (prostate cell line)</td><td>GSM2627219, GSM2627220</td><td>940697596</td><td>678377905</td><td>285470097</td><td>hg38
</td></tr><tr><td>endothelial of hepatic sinusoid primary cell</td><td>GSM2828874, GSM2828875</td><td>730217738</td><td>522713010</td><td>271344681</td><td>hg38
</td></tr><tr><td>astrocyte of the spinal cord primary cell</td><td>GSM2828825, GSM2828826</td><td>276423193</td><td>109354694</td><td>49930782</td><td>hg38
</td></tr><tr><td>endometrial microvascular endothelial primary cell</td><td>GSM2827534, GSM2827535</td><td>373079422</td><td>133037909</td><td>60888465</td><td>hg38
</td></tr><tr><td>brain microvascular endothelial primary cell</td><td>GSM2827278, GSM2827279</td><td>387977854</td><td>141244421</td><td>60870013</td><td>hg38
</td></tr><tr><td>brain pericyte primary cell</td><td>GSM2827225, GSM2827226</td><td>240015966</td><td>59111734</td><td>12095981</td><td>hg38
</td></tr><tr><td>astrocyte of the cerebellum primary cell</td><td>GSM2824366, GSM2824367</td><td>715071720</td><td>504740164</td><td>247980517</td><td>hg38
</td></tr><tr><td>primary epidermal keratinocyte, Differentiation Day 0</td><td>GSM2247305, GSM2247308</td><td>473817144</td><td>364191286</td><td>205550840</td><td>hg38
</td></tr><tr><td>primary epidermal keratinocyte, Differentiation Day 3</td><td>GSM2247306, GSM2247309</td><td>449446525</td><td>346772947</td><td>189532396</td><td>hg38
</td></tr><tr><td>primary epidermal keratinocyte, Differentiation Day 6</td><td>GSM2247307, GSM2247310</td><td>435822471</td><td>338426796</td><td>151820165</td><td>hg38
</td></tr><tr><td>HAP1 (near-haploid cell line)</td><td>GSM2494290, GSM2494294, GSM2494298</td><td>622379602</td><td>408952162</td><td>173929026</td><td>hg38
</td></tr><tr><td>HAP1 (near-haploid cell line), WAPL knock Out</td><td>GSM2494291, GSM2494295, GSM2494299</td><td>593103406</td><td>393669408</td><td>182414787</td><td>hg38
</td></tr><tr><td>HAP1 (near-haploid cell line), SSC Knock Out</td><td>GSM2494292, GSM2494296, GSM2494300</td><td>653465572</td><td>423459392</td><td>155690711</td><td>hg38
</td></tr><tr><td>HAP1 (near-haploid cell line), WAPL and SSC Knock OUT</td><td>GSM2494293, GSM2494297, GSM2494301</td><td>644874296</td><td>417017109</td><td>163294093</td><td>hg38
</td></tr><tr><td>H9 Human Embryonic Stem Cells</td><td>GSM2309023</td><td>312782126</td><td>227872293</td><td>76990193</td><td>hg38
</td></tr><tr><td>H9 Human ESC-derived Neuroectodermal Cells</td><td>GSM2309024</td><td>280384750</td><td>204502775</td><td>69749331</td><td>hg38
</td></tr><tr><td>purified human na•ve B cells</td><td>GSM2225739, GSM2225740</td><td>482533344</td><td>282478362</td><td>129481938</td><td>hg38
</td></tr><tr><td>purified human germinal center B cells</td><td>GSM2225741, GSM2225742</td><td>699595972</td><td>489209926</td><td>56161859</td><td>hg38
</td></tr><tr><td>Adrenal gland</td><td>GSM2322539</td><td>212977870</td><td>127874922</td><td>31843460</td><td>hg38
</td></tr><tr><td>Aorta</td><td>GSM1419084</td><td>777069820</td><td>545141096</td><td>123343548</td><td>hg38
</td></tr><tr><td>Bladder</td><td>GSM2322540 GSM2322541</td><td>539058463</td><td>335059444</td><td>66724835</td><td>hg38
</td></tr><tr><td>Dorsolateral Prefrontal Cortex</td><td>GSM2322542</td><td>186498461</td><td>112944919</td><td>37412569</td><td>hg38
</td></tr><tr><td>Hippocampus</td><td>GSM2322543</td><td>212040044</td><td>127560427</td><td>39547946</td><td>hg38
</td></tr><tr><td>Lung</td><td>GSM2322544 GSM2322545</td><td>352403963</td><td>194209688</td><td>33937230</td><td>hg38
</td></tr><tr><td>Liver</td><td>GSM1419086</td><td>949121479</td><td>693065051</td><td>161364911</td><td>hg38
</td></tr><tr><td>Left Ventricle</td><td>GSM1419085</td><td>1003815486</td><td>707218005</td><td>119249986</td><td>hg38
</td></tr><tr><td>Ovary</td><td>GSM2322546</td><td>226751982</td><td>132186511</td><td>28091638</td><td>hg38
</td></tr><tr><td>Pancreas</td><td>GSM2322547 GSM2322548 GSM2322549 GSM2322550</td><td>365907124</td><td>192813584</td><td>41672175</td><td>hg38
</td></tr><tr><td>Psoas</td><td>GSM2322551 GSM2322552 GSM2322553</td><td>334407202</td><td>196340226</td><td>32452891</td><td>hg38
</td></tr><tr><td>Right Ventricle</td><td>GSM2322554</td><td>746798299</td><td>524486724</td><td>99683550</td><td>hg38
</td></tr><tr><td>Small Bowel</td><td>GSM2322555</td><td>205647817</td><td>116205466</td><td>26555344</td><td>hg38
</td></tr><tr><td>Spleen</td><td>GSM2322556 GSM2322557</td><td>434667398</td><td>259662865</td><td>43224514</td><td>hg38
</td></tr><tr><td>Thymus</td><td>GSM1419083</td><td>794098314</td><td>575634749</td><td>63615707</td><td>hg38
</td></tr><tr><td>H1 Embroynic Stem Cell</td><td>GSM1267196 GSM1267197</td><td>1999419070</td><td>1342388287</td><td>393804147</td><td>hg38
</td></tr><tr><td>H1 Mesendoderm Cell</td><td>GSM1267198 GSM1267199</td><td>1459544582</td><td>1049545038</td><td>407820701</td><td>hg38
</td></tr><tr><td>H1 Mesenchymal Stem Cell</td><td>GSM1267200 GSM1267201</td><td>973402930</td><td>718127152</td><td>407461596</td><td>hg38
</td></tr><tr><td>H1 Neuronal Progenitor Cell</td><td>GSM1267202 GSM1267203</td><td>1531163120</td><td>1050094717</td><td>142246538</td><td>hg38
</td></tr><tr><td>H1 Trophectoderm Cell</td><td>GSM1267204 GSM1267205</td><td>1274418605</td><td>862793423</td><td>198533246</td><td>hg38
</td></tr><tr><td>fibroblast(CRL-2522) control</td><td>GSM2142399</td><td>154072731</td><td>90327184</td><td>19510925</td><td>hg38
</td></tr><tr><td>fibroblast(CRL-2522) dexamethasone 00h</td><td>GSM2142400</td><td>168986449</td><td>107643753</td><td>24375407</td><td>hg38
</td></tr><tr><td>fibroblast(CRL-2522) dexamethasone 08h</td><td>GSM2142401</td><td>104398997</td><td>68815975</td><td>16566433</td><td>hg38
</td></tr><tr><td>fibroblast(CRL-2522) dexamethasone 16h</td><td>GSM2142402</td><td>92150515</td><td>60205795</td><td>14481892</td><td>hg38
</td></tr><tr><td>fibroblast(CRL-2522) dexamethasone 24h</td><td>GSM2142403</td><td>84000000</td><td>55109676</td><td>14163578</td><td>hg38
</td></tr><tr><td>fibroblast(CRL-2522) dexamethasone 32h</td><td>GSM2142404</td><td>82843277</td><td>54622547</td><td>13591175</td><td>hg38
</td></tr><tr><td>fibroblast(CRL-2522) dexamethasone 40h</td><td>GSM2142405</td><td>116442811</td><td>79312915</td><td>17823572</td><td>hg38
</td></tr><tr><td>fibroblast(CRL-2522) dexamethasone 48h</td><td>GSM2142406</td><td>112361368</td><td>76055074</td><td>17363407</td><td>hg38
</td></tr><tr><td>fibroblast(CRL-2522) dexamethasone 56h</td><td>GSM2142407</td><td>130746108</td><td>89456982</td><td>21549275</td><td>hg38
</td></tr><tr><td>A549 00h 100 nM dexamethasone</td><td>GSM2437834 GSM2437835 GSM2437836 GSM2437837 GSM2437838<br> GSM2437839 GSM2437840 GSM2437841</td><td>2418001989</td><td>1561616864</td><td>524984581</td><td>hg38
</td></tr><tr><td>A549 01h 100 nM dexamethasone</td><td>GSM2437749 GSM2437750 GSM2437751 GSM2437752 GSM2437753<br> GSM2437754 GSM2437755</td><td>2334022843</td><td>1526509389</td><td>514912123</td><td>hg38
</td></tr><tr><td>A549 04h 100 nM dexamethasone</td><td>GSM2437783 GSM2437784 GSM2437785 GSM2437786 GSM2437787<br> GSM2437788 GSM2437789 GSM2437790</td><td>2316094376</td><td>1509752859</td><td>535752790</td><td>hg38
</td></tr><tr><td>A549 08h 100 nM dexamethasone</td><td>GSM2437857 GSM2437858 GSM2437859 GSM2437860 GSM2437861<br> GSM2437862 GSM2437863 GSM2437864</td><td>2140207414</td><td>1396880280</td><td>497153974</td><td>hg38
</td></tr><tr><td>A549 12h 100 nM dexamethasone</td><td>GSM2437806 GSM2437807 GSM2437808 GSM2437809 GSM2437810<br> GSM2437811 GSM2437812 GSM2437813</td><td>2270031457</td><td>1476433065</td><td>539393081</td><td>hg38
</td></tr><tr><td>LNCap prostate cancer cell line, BglII</td><td>GSM1902607 GSM1902608 GSM1902609 GSM1902610<br> GSM1902611 GSM1902612 GSM1902613 GSM1902614</td><td>889621669</td><td>673360213</td><td>15118646</td><td>hg38
</td></tr><tr><td>PC3 prostate cancer cell line, BglII</td><td>GSM1902605 GSM1902606</td><td>171640478</td><td>131779740</td><td>17819725</td><td>hg38
</td></tr><tr><td>PrEC normal Prostate epithelial cell, BglII</td><td>GSM1902602 GSM1902603 GSM1902604</td><td>535415703</td><td>388811231</td><td>27408976</td><td>hg38
</td></tr><tr><td>HUVEC, in-situ MboI</td><td>GSM1551629 GSM1551630 GSM1551631</td><td>732108988</td><td>483044556</td><td>231820747</td><td>hg38
</td></tr><tr><td>IMR90, in-situ MboI</td><td>GSM1551599 GSM1551600 GSM1551601 GSM1551602 GSM1551603 GSM1551604 GSM1551605</td><td>1535222082</td><td>1117646779</td><td>543778098</td><td>hg38
</td></tr><tr><td>K562, in-situ MboI</td><td>GSM1551618 GSM1551619 GSM1551620 GSM1551621 GSM1551622 GSM1551623</td><td>1366228845</td><td>1005752077</td><td>472332302</td><td>hg38
</td></tr><tr><td>KBM7, in-situ MboI</td><td>GSM1551624 GSM1551625 GSM1551626 GSM1551627 GSM1551628</td><td>1247936408</td><td>928748600</td><td>318829463</td><td>hg38
</td></tr><tr><td>NHEK, in-situ MboI</td><td>GSM1551614 GSM1551615 GSM1551616</td><td>1073207572</td><td>750552363</td><td>251312047</td><td>hg38
</td></tr><tr><td>MCF-10A</td><td>GSM1631184</td><td>289975071</td><td>205517192</td><td>13368580</td><td>hg38
</td></tr><tr><td>-MCF 7.00</td><td>GSM1631185</td><td>286286296</td><td>195332939</td><td>9301812</td><td>hg38
</td></tr><tr><td>MCF-10A scramble shRNA</td><td>GSM1930751 GSM1930752</td><td>206503892</td><td>143514936</td><td>6217083</td><td>hg38
</td></tr><tr><td>MCF-10A BRG1 shRNA</td><td>GSM1930753 GSM1930754</td><td>265434339</td><td>188054700</td><td>9561853</td><td>hg38
</td></tr><tr><td>MCF-7 non-specific shRNA</td><td>GSM1942100 GSM1942101</td><td>362651636</td><td>276336855</td><td>17083164</td><td>hg38
</td></tr><tr><td>MCF-7 RUNX1 shRNA</td><td>GSM1942102 GSM1942103</td><td>370021856</td><td>278779729</td><td>14963495</td><td>hg38
</td></tr><tr><td>KBM7 cell line</td><td>GSM1709920 GSM1709921</td><td>560643081</td><td>382272263</td><td>59618162</td><td>hg38
</td></tr><tr><td>SK-N-DZ Cell Line</td><td>GSM2825413, GSM2825414</td><td>291853821</td><td>199012361</td><td>21715217</td><td>hg38
</td></tr><tr><td>GM12878, in-situ MboI</td><td>GSM1551552 GSM1551553 GSM1551554 GSM1551555 <br>GSM1551556 GSM1551557 GSM1551558 GSM1551559 GSM1551560 GSM1551561 <br>GSM1551562 GSM1551563 GSM1551564 GSM1551565 GSM1551566 GSM1551567 <br>GSM1551569 GSM1551570 GSM1551571 GSM1551572 GSM1551573 GSM1551574<br> GSM1551575 GSM1551576 GSM1551577 GSM1551578 GSM1551597 GSM1551598 <br>GSM1551682 GSM1551695 GSM1551696 GSM1551697 GSM1551699 GSM1551700 <br>GSM1551701 GSM1551702 GSM1551703 GSM1551704 GSM1551705 <br>GSM1551706 GSM1551707 GSM1551708 GSM1551709 GSM1551710 GSM1551711 <br>GSM1551712 GSM1551713 GSM1551714 GSM1551715 GSM1551716 GSM1551717<br> GSM1551718 GSM1551719 GSM1551720 GSM1551721 GSM1551722 GSM1551723 <br>GSM1551724 GSM1551725 GSM1551726 GSM1551727 GSM1551728 GSM1551730 <br>GSM1551731 GSM1551732 GSM1551733 GSM1551734 GSM1551735 <br>GSM1551736 GSM1551737 GSM1551738 GSM1551739 <br>GSM1551740 GSM1551743 GSM1551746 GSM1551749</td><td>5864946933</td><td>4495290968</td><td>2079266425</td><td>hg38</td></tr></tbody></table>
							</div>

							<div class="pt-5 table-responsive tab-pane fade" id="capturehic">
								<table class='table table-sm table-bordered text-center' style='border-top:2px solid #777777; line-height:28px;'>
									<thead class='table-secondary' style='font-size:13px; border:0;'>
										<tr>
											<td style='vertical-align: middle;'>Sample & Description</td><td style='vertical-align: middle;'>GEO Ids</td><td style='vertical-align: middle;'>Total target reads</td><td style='vertical-align: middle;'>Total target reads without duplicates</td><td style='vertical-align: middle;'>cis target reads (>15kb)</td><td style='vertical-align: middle;'>Reference genome
											</td>
										</tr>
									</thead>
									<tbody style='font-size:11px;'>
										<tr>
											<td>Adrenal gland</td><td>GSM2297098,GSM2297099,GSM2297100,GSM2297101,GSM2297102,GSM2297103</td><td>53452991</td><td>52920522</td><td>16438489</td><td>hg19
											</td>
										</tr>
										<tr>
											<td>Aorta</td><td>GSM2297104,GSM2297105,GSM2297106,GSM2297107,GSM2297108,<br>GSM2297109,GSM2297110,GSM2297111,GSM2297112,GSM2297113,<br>GSM2297114,GSM2297115,GSM2297116,GSM2297117,GSM2297118<br>,GSM2297119,GSM2297120,GSM2297121,GSM2297122</td><td>95373405</td><td>77962154</td><td>24066751</td><td>hg19
											</td>
										</tr>
										<tr>
											<td>Bladder</td><td>GSM2297123,GSM2297124,GSM2297125,GSM2297126,GSM2297127,<br>GSM2297128,GSM2297129,GSM2297130,GSM2297131,GSM2297132,<br>GSM2297133,GSM2297134</td><td>56593169</td><td>54686678</td><td>16122130</td><td>hg19
											</td>
										</tr>
										<tr>
											<td>Cardiomyocytes</td><td>GSM2297135,GSM2297136,GSM2297137,GSM2297138,GSM2297139</td><td>422022726</td><td>61938295</td><td>21695756</td><td>hg19
											</td>
										</tr>
										<tr>
											<td>Esophagus</td><td>GSM2297146,GSM2297147,GSM2297148,GSM2297149,GSM2297150,GSM2297151</td><td>10374123</td><td>10344763</td><td>2547084</td><td>hg19
											</td>
										</tr>
										<tr>
											<td>FAT</td><td>GSM2297152,GSM2297153,GSM2297154,GSM2297155,GSM2297156,GSM2297157</td><td>10616964</td><td>10583273</td><td>3153844</td><td>hg19
											</td>
										</tr>
										<tr>
											<td>Gastric tissue</td><td>GSM2297165,GSM2297166,GSM2297167,GSM2297168,GSM2297169,<br>GSM2297170,GSM2297171,GSM2297172,GSM2297173,GSM2297174,<br>GSM2297175,GSM2297176,GSM2297177</td><td>138955523</td><td>115003474</td><td>25563306</td><td>hg19</td>
										</tr>
										<tr>
											<td>GM12878+GM19240 Lymphoblastoid Cell Line</td><td>GSM2297231,GSM2297232,GSM2297233,GSM2297234,GSM2297235,<br>GSM2297236,GSM2297237,GSM2297238,GSM2297239,GSM2297240,GSM2297241,<br>GSM2297242,GSM2297243,GSM2297244,GSM2297245,GSM2297246,GSM2297247,<br>GSM2297248,GSM2297249,GSM2297250,GSM2297251</td><td>147323140</td><td>143808178</td><td>60112159</td><td>hg19</td>
										</tr>
										<tr>
											<td>H1 Embroynic Stem Cell</td><td>GSM2297185,GSM2297186,GSM2297187,GSM2297188,GSM2297189,<br>GSM2297190,GSM2297191,GSM3067207,GSM3067208,GSM3067209,GSM3067210,<br>GSM3067211,GSM3067212,GSM3067213,GSM3067214,GSM3067215,GSM3067216</td><td>51424036</td><td>50608157</td><td>18360249</td><td>hg19</td>
										</tr>
										<tr>
											<td>Hippocampus</td><td>GSM2297178,GSM2297179,GSM2297180,GSM2297181,GSM2297182,GSM2297183,GSM2297184</td><td>88270555</td><td>68449710</td><td>22857412</td><td>hg19</td>
										</tr>
										<tr>
											<td>Fibroblast cells</td><td>GSM2297158,GSM2297159,GSM2297160,GSM2297161,GSM2297162,GSM2297163,GSM2297164</td><td>60252157</td><td>50394867</td><td>20208593</td><td>hg19</td>
										</tr>
										<tr>
											<td>Lung</td><td>GSM2297208,GSM2297209,GSM2297210,GSM2297211,GSM2297212,<br>GSM2297213,GSM2297214,GSM2297215,GSM2297216,GSM2297217,<br>GSM2297218,GSM2297219,GSM2297220,GSM2297221,GSM2297222,GSM2297223,<br>GSM2297224,GSM2297225,GSM2297226,GSM2297227,GSM2297228,<br>GSM2297229,GSM2297230,GSM3067217</td><td>95681577</td><td>87429824</td><td>19278659</td><td>hg19</td>
										</tr>
										<tr>
											<td>Liver</td><td>GSM2297201,GSM2297202,GSM2297203,GSM2297204,GSM2297205,<br>GSM2297206,GSM2297207</td><td>50273060</td><td>49981913</td><td>13917804</td><td>hg19</td>
										</tr>
										<tr>
											<td>Left Ventricle</td><td>GSM2297192,GSM2297193,GSM2297194,GSM2297195,<br>GSM2297196,GSM2297197,GSM2297198,GSM2297199,GSM2297200,<br>GSM3067218,GSM3067219</td><td>152592087</td><td>102105557</td><td>22803181</td><td>hg19</td>
										</tr>
										<tr>
											<td>H1-derived Mesendoderm Cell</td><td>GSM2297256</td><td>42426985</td><td>42426985</td><td>16852133</td><td>hg19</td>
										</tr>
										<tr>
											<td>H1-derived Mesenchymal Stem Cell</td><td>GSM2297252,GSM2297253,GSM2297254,GSM2297255</td><td>32031672</td><td>31965792</td><td>17922970</td><td>hg19</td>
										</tr>
										<tr>
											<td>H1-derived Neuronal Progenitor Cell</td><td>GSM2297257</td><td>52025048</td><td>52025048</td><td>8439809</td><td>hg19</td>
										</tr>
										<tr>
											<td>Ovary</td><td>GSM2297258,GSM2297259,GSM2297260,GSM2297261,GSM2297262,GSM2297263</td><td>56875013</td><td>56561216</td><td>11998440</td><td>hg19</td>
										</tr>
										<tr>
											<td>Pancreas</td><td>GSM2297264,GSM2297265,GSM2297266,GSM2297267,<br>GSM2297268,GSM2297269,GSM2297270,GSM2297271,GSM2297272,<br>GSM2297273,GSM2297274</td><td>104801584</td><td>68972802</td><td>18281393</td><td>hg19</td>
										</tr>
										<tr>
											<td>Psoas</td><td>GSM2297275,GSM2297276,GSM2297277,GSM2297278,<br>GSM2297279,GSM2297280,GSM2297281,GSM2297282</td><td>32328663</td><td>32251565</td><td>8743192</td><td>hg19</td>
										</tr>
										<tr>
											<td>Right heart atrium</td><td>GSM2297283,GSM2297284,GSM2297285,<br>GSM2297286,GSM2297287,GSM2297288</td><td>9100381</td><td>9072044</td><td>2010420</td><td>hg19</td>
										</tr>
										<tr>
											<td>Right Ventricle</td><td>GSM2297289,GSM2297290,GSM2297291,GSM2297292,<br>GSM2297293,GSM2297294,GSM2297295,GSM2297296,GSM2297297</td><td>108516272</td><td>77995188</td><td>18862128</td><td>hg19</td>
										</tr>
										<tr>
											<td>Small Bowel</td><td>GSM2297304,GSM2297305,GSM2297306,GSM2297307,<br>GSM2297308,GSM2297309,GSM3067220</td><td>116702509</td><td>100726319</td><td>24677284</td><td>hg19</td>
										</tr>
										<tr>
											<td>Sigmoid colon</td><td>GSM2297298,GSM2297299,GSM2297300,GSM2297301,<br>GSM2297302,GSM2297303</td><td>6243346</td><td>6222129</td><td>1739343</td><td>hg19</td>
										</tr>
										<tr>
											<td>Spleen</td><td>GSM2297310,GSM2297311,GSM2297312,GSM2297313,<br>GSM2297314,GSM2297315,GSM2297316,GSM2297317,GSM3067221,<br>GSM3067222,GSM3067223,GSM3067224,GSM3067225</td><td>157610839</td><td>116878837</td><td>37228351</td><td>hg19</td>
										</tr>
										<tr>
											<td>Trophoblast</td><td>GSM2297323</td><td>25427950</td><td>25427950</td><td>9422392</td><td>hg19</td>
										</tr>
										<tr>
											<td>Thymus</td><td>GSM2297318,GSM2297319,GSM2297320,GSM2297321,GSM2297322</td><td>71664240</td><td>69917250</td><td>14567128</td><td>hg19</td>
										</tr>
										<tr>
											<td>Dorsorateral prefrontal cortex</td><td>GSM2297140,GSM2297141,GSM2297142,GSM2297143,<br>GSM2297144,GSM2297145,GSM3067226,GSM3067227,GSM3067228,<br>GSM3067229</td><td>248936972</td><td>186423789</td><td>84258470</td><td>hg19</td>
										</tr>
									</tbody>
								</table>
							</div>


							<div class="pt-5 table-responsive tab-pane fade" id="cancerhic">
<table class='table table-sm table-bordered text-center' style='border-top:2px solid #777777; line-height:28px;'>
<thead class='table-secondary' style='font-size:13px; border:0;'><tr><td style='vertical-align: middle;'>Sample & Description</td><td style='vertical-align: middle;'>GEO Ids</td><td style='vertical-align: middle;'>Raw read counts</td><td style='vertical-align: middle;'>Properly aligned reads</td><td style='vertical-align: middle;'>Valid interaction reads</td><td style='vertical-align: middle;'>Cancer type</td><td style='vertical-align: middle;'>Sample type</td><td style='vertical-align: middle;'>Reference genome</td><td style='vertical-align: middle;'>Note
</td></tr></thead><tbody style='font-size:11px;'><tr><td>T cell acute lymphoblastic leukemia (T-ALL)</td><td>GSM3967118</td><td>193032799</td><td>130942285</td><td>96466328</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T cell acute lymphoblastic leukemia (T-ALL)</td><td>GSM3967119</td><td>197679209</td><td>120965433</td><td>68296578</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T cell acute lymphoblastic leukemia (T-ALL)</td><td>GSM3967120</td><td>265987545</td><td>139031468</td><td>81887865</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T cell acute lymphoblastic leukemia (T-ALL)</td><td>GSM3967121</td><td>200161885</td><td>131461326</td><td>75545449</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Early T-lineage progenitor acute lymphoblastic leukemia (ETP-ALL)</td><td>GSM3967122</td><td>276855502</td><td>189315287</td><td>113394948</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Early T-lineage progenitor acute lymphoblastic leukemia (ETP-ALL)</td><td>GSM3967123</td><td>316151698</td><td>159556782</td><td>107566067</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Early T-lineage progenitor acute lymphoblastic leukemia (ETP-ALL)</td><td>GSM3967124</td><td>309176594</td><td>194550254</td><td>131150618</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Early T-lineage progenitor acute lymphoblastic leukemia (ETP-ALL)</td><td>GSM3967125</td><td>266194234</td><td>160701593</td><td>109632441</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Nalm6 (B cell precursor leukemia cell line)</td><td>GSM3211391</td><td>1275566502</td><td>994058249</td><td>686270725</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HL60/S4 (neutrophil-like Myeloid leukemia cell line)</td><td>GSM3185669, GSM3185670, GSM3185671</td><td>1392563071</td><td>1168615919</td><td>179898496</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HL60/S4 (neutrophil-like Myeloid leukemia cell line), migrate through 5_m pores</td><td>GSM3185672, GSM3185673, GSM3185674</td><td>1425304832</td><td>1213318509</td><td>156486225</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HL60/S4 (neutrophil-like Myeloid leukemia cell line), migrate through 14_m pores</td><td>GSM3185675, GSM3185676, GSM3185677</td><td>1472754268</td><td>1269450782</td><td>115879458</td><td>Acute_Myeloid_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SK-N-SH (neuroblastoma cell line)</td><td>GSM3192056</td><td>36065962</td><td>25124015</td><td>11184902</td><td>Brain_Glioblastoma_Multiforme</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SK-N-SH (neuroblastoma cell line), Heterozygous for the Pcdh_ gene cluster generated by CRISPR-Cas9</td><td>GSM3192057</td><td>41554603</td><td>28484054</td><td>12677646</td><td>Brain_Glioblastoma_Multiforme</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>U251 (glioblastoma cell line)</td><td>GSM3567145, GSM3567146, GSM3567147, GSM3567148</td><td>248494476</td><td>177645236</td><td>19333130</td><td>Brain_Glioblastoma_Multiforme</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>U251 (glioblastoma cell line), treat 1mM TMZ, 72hour</td><td>GSM3567149, GSM3567150</td><td>233025427</td><td>166221469</td><td>22024184</td><td>Brain_Glioblastoma_Multiforme</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SK-N-MC (Ewing's sarcoma cell line)</td><td>GSM2828694, GSM2828695</td><td>313811254</td><td>213786296</td><td>168120056</td><td>Brain_Glioblastoma_Multiforme</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SK-MEL-5 (skin cancer cell line)</td><td>GSM2827188, GSM2827189</td><td>303482692</td><td>216628354</td><td>76316058</td><td>Brain_Glioblastoma_Multiforme</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCC1954 (Breast cancer cell line)</td><td>GSM3258551</td><td>307000648</td><td>192881233</td><td>123159628</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>MCF-7 (endocrine-sensitive breast cancer cells), grown without exposure to endocrine therapy, culture start</td><td>GSM3756149,GSM3756150</td><td>121516303</td><td>61447951</td><td>25783799</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>MCF-7 (endocrine-sensitive breast cancer cells), grown without exposure to endocrine therapy, culture 3month</td><td>GSM3756151,GSM3756152</td><td>104171764</td><td>55029344</td><td>20784817</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>MCF-7 (endocrine-sensitive breast cancer cells), grown without exposure to endocrine therapy, culture 6month</td><td>GSM3756153,GSM3756154</td><td>108539361</td><td>56348977</td><td>20615675</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>MCF-7 (endocrine-sensitive breast cancer cells), endocrine-sensitive ER+ cell</td><td>GSM3336890,GSM3336891,GSM3336892</td><td>524174508</td><td>368180101</td><td>196366648</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>MCF-7 (endocrine-sensitive breast cancer cells), Tamoxifen-resistant (TAMR) cell</td><td>GSM3336893,GSM3336894,GSM3336895</td><td>547549934</td><td>372437992</td><td>198695296</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>MCF-7 (endocrine-sensitive breast cancer cells), Fulvestrant-resistant cell</td><td>GSM3336896,GSM3336897,GSM3336898</td><td>391118222</td><td>275774008</td><td>138825908</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T-47D (ductal carcinoma cell line)</td><td>GSM3044586, GSM3044588, GSM3044590</td><td>775262422</td><td>570818891</td><td>207562883</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T-47D (ductal carcinoma cell line), treat 110 mM NaCl, 1hour</td><td>GSM3044586, GSM3044588, GSM3044592</td><td>758804089</td><td>561715369</td><td>302976267</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T-47D (ductal carcinoma cell line), treat 500 nM triptolide, 2hour prior stress</td><td>GSM3044591</td><td>217097383</td><td>162158512</td><td>65221863</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T-47D (ductal carcinoma cell line), treat 500 nM triptolide, 2hour prior stress and treat 110 mM NaCl, 1hour</td><td>GSM3044593</td><td>237979290</td><td>177917258</td><td>68094499</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T-47D (ductal carcinoma cell line), treat 110 mM NaCl, 1hour and isotonic meida recovery</td><td>GSM3044594</td><td>216206171</td><td>161108397</td><td>59305439</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T-47D (ductal carcinoma cell line), treat 500 nM triptolide, 2hour prior stress -> treat 110 mM NaCl, 1hour -> isotonic meida recovery</td><td>GSM3044595</td><td>226390402</td><td>168280639</td><td>68038656</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T47D (mammary ductal carcinoma cell line)</td><td>GSM2827515, GSM2827516</td><td>247702528</td><td>739868478</td><td>339227319</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>MCF10CA1a (fully malignant breast cancer cell)</td><td>GSM2599095, GSM2599096</td><td>415903729</td><td>290561734</td><td>146980469</td><td>Breast_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, MboI G1 sync control, STAG2 siRNA depleted</td><td>GSM4106791</td><td>1334974287</td><td>974345842</td><td>570828085</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, MboI G1 sync control</td><td>GSM4106789</td><td>1474037625</td><td>1096634407</td><td>508028022</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, HindIII G1 sync control, ESCO siRNA depleted</td><td>GSM4106797</td><td>450331684</td><td>335703425</td><td>171035950</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, HindIII G1 sync control, CTCF and STAG2 siRNA depleted</td><td>GSM4106795</td><td>478820518</td><td>361666274</td><td>155716678</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, HindIII G1 sync control, CTCF and ESCO1 siRNA depleted</td><td>GSM4106796</td><td>621991903</td><td>469213039</td><td>312682032</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, MboI G1 sync control, auxin-inducible degron (AID) tag fused to STAG1, no auxin treat</td><td>GSM4106798</td><td>221654568</td><td>160764087</td><td>92241896</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, HindIII G1 sync control</td><td>GSM4106788</td><td>439832590</td><td>329547597</td><td>128827283</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, MboI G1 sync control, auxin-inducible degron (AID) tag fused to STAG2, no auxin treat</td><td>GSM4106800</td><td>243928711</td><td>175498024</td><td>96579758</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, MboI G1 sync control, STAG1 siRNA depleted</td><td>GSM4106790</td><td>1369342451</td><td>684678334</td><td>401840636</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, MboI G1 sync control, auxin-inducible degron (AID) tag fused to STAG1, auxin treat</td><td>GSM4106799</td><td>233168235</td><td>168228939</td><td>104025583</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, HindIII G1 sync control, CTCF and STAG1 siRNA depleted</td><td>GSM4106802</td><td>524372470</td><td>388356198</td><td>184814394</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, HindIII G1 sync control, STAG1 siRNA depleted</td><td>GSM4106792</td><td>477857849</td><td>353241842</td><td>159787036</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, HindIII G1 sync control, CTCF siRNA depleted</td><td>GSM4106794</td><td>529310863</td><td>393671192</td><td>185376865</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, MboI G1 sync control, auxin-inducible degron (AID) tag fused to STAG2, auxin treat</td><td>GSM4106801</td><td>192766656</td><td>137419739</td><td>77798157</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto cell, HindIII G1 sync control, STAG2 siRNA depleted</td><td>GSM4106793</td><td>498530119</td><td>374842559</td><td>180759922</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa F2 cell, treated for 24 hours with 1000 U/ml of recombinant human IFNg</td><td>GSM3489420</td><td>190051197</td><td>119188735</td><td>51817331</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, synchronized at G1</td><td>GSM2747738</td><td>439832590</td><td>329547593</td><td>128827288</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, WAPL depleted by RNA inference</td><td>GSM2747739</td><td>401825457</td><td>298295379</td><td>121433281</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, Pds5SA/B depleted by RNA inference</td><td>GSM2747740</td><td>416096383</td><td>311279545</td><td>145477604</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, WAPL and Pds5SA/B depleted by RNA inference</td><td>GSM2747741</td><td>478685424</td><td>352573375</td><td>179019299</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, synchronized at ProMeta-phase</td><td>GSM2747742</td><td>567505689</td><td>381400441</td><td>201561605</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, synchronized at S</td><td>GSM2747743</td><td>563598410</td><td>404009504</td><td>185650152</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, synchronized at G2</td><td>GSM2747744</td><td>469250696</td><td>338041622</td><td>172751017</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, Scc1-auxin inducible degradation, 0min</td><td>GSM2747745, GSM2747748</td><td>470901785</td><td>362811632</td><td>166125583</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, Scc1-auxin inducible degradation, 15min</td><td>GSM2747746</td><td>213736222</td><td>163625163</td><td>73833724</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, Scc1-auxin inducible degradation, 180min</td><td>GSM2747747</td><td>202333155</td><td>152322874</td><td>72530006</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, Scc1-auxin inducible degradation, 120min</td><td>GSM2747749</td><td>277731088</td><td>213202735</td><td>98841687</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto</td><td>GSM2747750</td><td>250011492</td><td>182489661</td><td>85533030</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, CTCF-auxin inducible degradation, 0min</td><td>GSM2747751</td><td>193320940</td><td>148644389</td><td>68672788</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, CTCF-auxin inducible degradation, 120min</td><td>GSM2747752</td><td>256397765</td><td>195673131</td><td>74981875</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, Scc1-auxin inducible degradation, WAPL and Pds5SA/B depleted by RNA inference, 0min</td><td>GSM2747753</td><td>286703129</td><td>219745687</td><td>106011769</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, Scc1-auxin inducible degradation, WAPL and Pds5SA/B depleted by RNA inference, 15min</td><td>GSM2747754</td><td>263867376</td><td>201779982</td><td>98221504</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HeLa Kyoto, Scc1-auxin inducible degradation, WAPL and Pds5SA/B depleted by RNA inference, 180min</td><td>GSM2747755</td><td>275744840</td><td>209337846</td><td>85529247</td><td>Cervical_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CTCF-auxin inducible degradation, treat AUX, 24hour</td><td>GSM4198767, GSM4198771</td><td>465865280</td><td>353386514</td><td>255131882</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CTCF-auxin inducible degradation, treat DMSO, 168hour</td><td>GSM4198768, GSM4198772</td><td>479596495</td><td>361947852</td><td>265290366</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CEBPA fused with the estrogen receptor (ER) hormone-binding domain, induced 9hour</td><td>GSM4198746, GSM4198756</td><td>583026816</td><td>432495135</td><td>302453530</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CEBPA fused with the estrogen receptor (ER) hormone-binding domain</td><td>GSM4198745, GSM4198755</td><td>622131622</td><td>459031035</td><td>330061827</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CEBPA fused with the estrogen receptor (ER) hormone-binding domain, induced 18hour</td><td>GSM4198747, GSM4198757</td><td>532594603</td><td>392497055</td><td>282295427</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CEBPA fused with the estrogen receptor (ER) hormone-binding domain, induced 24hour</td><td>GSM4198748, GSM4198758</td><td>566734963</td><td>414177399</td><td>284885599</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CEBPA fused with the estrogen receptor (ER) hormone-binding domain, induced 72hour</td><td>GSM4198750, GSM4198760</td><td>556616461</td><td>402980539</td><td>277968872</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CEBPA fused with the estrogen receptor (ER) hormone-binding domain, induced 120hour</td><td>GSM4198752, GSM4198762</td><td>519515589</td><td>377089534</td><td>261362720</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CTCF-auxin inducible degradation, treat DMSO, 24hour</td><td>GSM4198766, GSM4198770</td><td>512188670</td><td>388419973</td><td>279641145</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CEBPA fused with the estrogen receptor (ER) hormone-binding domain, induced 96hour</td><td>GSM4198751, GSM4198761</td><td>589211629</td><td>434980151</td><td>314192501</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CEBPA fused with the estrogen receptor (ER) hormone-binding domain, induced 144hour</td><td>GSM4198753, GSM4198763</td><td>576709794</td><td>425268020</td><td>310290677</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CEBPA fused with the estrogen receptor (ER) hormone-binding domain, induced 168hour</td><td>GSM4198754, GSM4198764</td><td>546596448</td><td>396780826</td><td>277109452</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CTCF-auxin inducible degradation, treat AUX, 168hour</td><td>GSM4198769, GSM4198773</td><td>495575272</td><td>372849896</td><td>271838196</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CTCF-auxin inducible degradation</td><td>GSM4198765</td><td>248644064</td><td>183405393</td><td>121304011</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>BLaER (lymphoblastic leukemia cell line), CEBPA fused with the estrogen receptor (ER) hormone-binding domain, induced 48hour</td><td>GSM4198749, GSM4198759</td><td>583502120</td><td>433365827</td><td>312042799</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>K562 (chronic myelogenous leukemia cell line), heat shock, after 30min</td><td>GSM3753207, GSM3753208</td><td>213388814</td><td>107594977</td><td>84758898</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>K562 (chronic myelogenous leukemia cell line), heat shock, before 30min (control)</td><td>GSM3753209, GSM3753210</td><td>214917980</td><td>107839121</td><td>85566155</td><td>Chronic_Lymphocytic_Leukemia</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT116_CRISPR_D134</td><td>in-house</td><td>410558179</td><td>310459876</td><td>21375371</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SW480 (Colon cancer cell line), treated with siRNA targeting TCF7L2, 48hour elapsed</td><td>GSM4594448</td><td>181308137</td><td>116302752</td><td>36211178</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SW480 (Colon cancer cell line), treated with siRNA targeting TCF7L2, 24hour elapsed</td><td>GSM4594447</td><td>134926370</td><td>85695391</td><td>28289587</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT116_CRISPR_GFP</td><td>in-house</td><td>168289026</td><td>121970894</td><td>46312852</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SW480 (Colon cancer cell line), treated with siRNA targeting TCF7L2, 72hour elapsed</td><td>GSM4594449</td><td>179139853</td><td>113229480</td><td>32944595</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SW480 (Colon cancer cell line), negative control</td><td>GSM4594446</td><td>112115490</td><td>71855067</td><td>22497632</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-328T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>1016866474</td><td>362066760</td><td>321609402</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_12-251T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>1210877828</td><td>445048545</td><td>388355992</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_15-446T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>916730868</td><td>334685711</td><td>304597659</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-1083T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>1145063964</td><td>419052208</td><td>376392291</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-1413T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>628874197</td><td>463368857</td><td>400123137</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-542T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>726621467</td><td>541981767</td><td>480629779</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-151T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>818660971</td><td>628465310</td><td>521665179</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-1317T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>298009919</td><td>212634363</td><td>204822353</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_15-418T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>785066885</td><td>456611319</td><td>408145804</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-810T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>805136438</td><td>301791043</td><td>280946525</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-326T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>482282490</td><td>355409488</td><td>327393059</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-1074T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>984601002</td><td>366762119</td><td>317184620</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-63T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>550068401</td><td>402577420</td><td>361863901</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_15-1382T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>812722208</td><td>295250914</td><td>271145517</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-52T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>1216914618</td><td>453236607</td><td>398507239</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-426T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>482191004</td><td>360317858</td><td>331738554</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-442T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>519658705</td><td>385872114</td><td>350674378</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-1410T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>578470936</td><td>436927972</td><td>378770443</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-545T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>564765772</td><td>417869263</td><td>368839819</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-1321T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>563181589</td><td>415329729</td><td>348250452</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-927T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>534368946</td><td>393544986</td><td>357884287</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_09-376T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>898666006</td><td>333040669</td><td>297637843</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_15-1420T (Korean colorectal cancer patient tissue, stage IV)</td><td>in-house</td><td>537908101</td><td>393673874</td><td>355607090</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-1334T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>1085370254</td><td>414620702</td><td>361238626</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-1320T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>426016679</td><td>316923049</td><td>274445347</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-257T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>498018585</td><td>368228643</td><td>333516820</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-275T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>1011160752</td><td>372086657</td><td>335829814</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-494T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>425579257</td><td>317246279</td><td>294434533</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-1483T (Korean colorectal cancer patient tissue, stage IV)</td><td>in-house</td><td>416315674</td><td>314015561</td><td>266828152</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-114T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>370480745</td><td>280948840</td><td>252825471</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-258T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>430690459</td><td>319915005</td><td>258378529</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-91T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>393399210</td><td>302811121</td><td>255630334</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-51T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>224138840</td><td>158257932</td><td>152291160</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-1251T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>870219271</td><td>654380248</td><td>543113422</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_16-178T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>906664712</td><td>335959814</td><td>304190187</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-983T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>1086107826</td><td>399716864</td><td>360345103</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-731T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>456591112</td><td>335460287</td><td>300322158</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-1026T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>441190438</td><td>324944476</td><td>299980665</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-132T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>956439482</td><td>354875863</td><td>320172870</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-431T (Korean colorectal cancer patient tissue, stage III)</td><td>in-house</td><td>563315086</td><td>408070272</td><td>367236854</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SW480_ (Colon cancer cell line)</td><td>GSM3399745</td><td>187026476</td><td>114741021</td><td>86040663</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SW480_rep1 (Colon cancer cell line)</td><td>GSM3399746</td><td>190315400</td><td>117167330</td><td>88403786</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SW480_rep2 (Colon cancer cell line)</td><td>GSM3258549</td><td>377341876</td><td>231908351</td><td>174441896</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNU-C1 (Colon cancer cell line)</td><td>GSM3258550</td><td>339918762</td><td>205302613</td><td>152349841</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT116 cell, auxin-inducible degron (AID) tag fused to STAG1, no auxin treat</td><td>GSM3898434, GSM3898436</td><td>743911551</td><td>612469221</td><td>92224538</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT116 cell, auxin-inducible degron (AID) tag fused to STAG1, auxin treat</td><td>GSM3898435, GSM3898437</td><td>726253925</td><td>593297923</td><td>84862533</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT116 cell, auxin-inducible degron (AID) tag fused to STAG2, no auxin treat</td><td>GSM3898438, GSM3898440</td><td>769369877</td><td>635106247</td><td>106374736</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT116 cell, auxin-inducible degron (AID) tag fused to STAG2, auxin treat</td><td>GSM3898439, GSM3898441</td><td>763091360</td><td>631503667</td><td>102417490</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>DLD-1 (colorectal cancer cell line)</td><td>GSM2825476, GSM2825477</td><td>404191479</td><td>266737379</td><td>171908739</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, G1 synchronized</td><td>GSM2809546, GSM2809547, GSM2809548, GSM2809549</td><td>220289469</td><td>159033393</td><td>93780861</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, G1 synchronized, 6hour axin treat</td><td>GSM2809550, GSM2809551, GSM2809552, GSM2809553</td><td>241992826</td><td>172527730</td><td>92724959</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 20min withdrawal</td><td>GSM2809563, GSM2809564, GSM2809565, GSM2809566</td><td>950805510</td><td>638636233</td><td>310340932</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 40min withdrawal</td><td>GSM2809567, GSM2809568, GSM2809569, GSM2809570</td><td>952354170</td><td>639322841</td><td>297464144</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 60min withdrawal</td><td>GSM2809571, GSM2809572, GSM2809573, GSM2809574</td><td>908648083</td><td>606838999</td><td>269739393</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 180min withdrawal</td><td>GSM2809575, GSM2809576, GSM2809577, GSM2809578</td><td>934030332</td><td>638317762</td><td>313873322</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, control</td><td>GSM2809579, GSM2809580, GSM2809591, GSM2809592</td><td>23085031</td><td>17539103</td><td>11423204</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 20min axin treat</td><td>GSM2809581, GSM2809582</td><td>14714658</td><td>10988465</td><td>8131952</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 40min axin treat</td><td>GSM2809583, GSM2809584</td><td>11741884</td><td>8822710</td><td>6881622</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 60min axin treat</td><td>GSM2809585, GSM2809586</td><td>12843505</td><td>9561702</td><td>6389052</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 4hour axin treat</td><td>GSM2809587, GSM2809588</td><td>26087068</td><td>19586116</td><td>13958259</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat</td><td>GSM2809589, GSM2809590, GSM2809593, GSM2809594</td><td>25697370</td><td>19370308</td><td>12981860</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 20min withdrawal</td><td>GSM2809601, GSM2809602</td><td>11190211</td><td>8443381</td><td>5705605</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 40min withdrawal</td><td>GSM2809603, GSM2809604</td><td>9924236</td><td>7458193</td><td>4918019</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 60min withdrawal</td><td>GSM2809605, GSM2809606</td><td>7543843</td><td>5673656</td><td>3669498</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 3hour withdrawal</td><td>GSM2809607, GSM2809608</td><td>39669944</td><td>30174165</td><td>20492648</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 6hour withdrawal</td><td>GSM2809595, GSM2809596</td><td>34745290</td><td>26319343</td><td>17962616</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 18hour withdrawal</td><td>GSM2809597, GSM2809598</td><td>38042401</td><td>29068467</td><td>19702061</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HCT-116 (colorectal cancer cell line), RAD21 alleles were tagged with an AID domain and a fluorescent mClover, 6hour axin treat, 24hour withdrawal</td><td>GSM2809599, GSM2809600</td><td>43711082</td><td>33460211</td><td>23870347</td><td>Colon_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>OE33 (Esophegeal adenocarcinoma cell line)</td><td>GSM3258552</td><td>417226018</td><td>297042519</td><td>145894672</td><td>Esophageal_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNU16 (gastric cancer cell line)</td><td>GSM3327706</td><td>648672493</td><td>413369981</td><td>188778330</td><td>Gastric_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T2000877 (gastric cancer cell line), CCNE1-rearranged gastric cancer cell line</td><td>GSM3333325</td><td>677031899</td><td>453076155</td><td>136087596</td><td>Gastric_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T990275 (gastric cancer cell line), CCNE1-rearranged gastric cancer cell line</td><td>GSM3356360</td><td>697358488</td><td>473569205</td><td>141399494</td><td>Gastric_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>293TRex-Flag-BRD4-NUT-HA, treat 1 _g/mL tetracycline for 8 hours</td><td>GSM3901271, GSM3901272</td><td>2038185812</td><td>1375543153</td><td>805027128</td><td>Kidney_Renal_Clear_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>786-O cell line (renal cancer cell line)</td><td>GSM2631392, GSM2631394</td><td>406407667</td><td>255994015</td><td>95951889</td><td>Kidney_Renal_Clear_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>786-M1A cell line (renal cancer cell line)</td><td>GSM2631393, GSM2631395</td><td>312761591</td><td>197915749</td><td>84268637</td><td>Kidney_Renal_Clear_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>G-401 (kidney cancer cell line)</td><td>GSM2825105, GSM2825106</td><td>340927844</td><td>239661440</td><td>108648697</td><td>Kidney_Renal_Clear_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HepG2 (hepatocellular carcinoma cell line)</td><td>GSM2825569, GSM2825570</td><td>3403119430</td><td>2040933222</td><td>1281995118</td><td>Liver_Hepatocellular_carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>NCI-H460 (lung cancer cell line)</td><td>GSM2827554, GSM2827555</td><td>313205689</td><td>218089310</td><td>142941579</td><td>Lung_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>A549 (lung cancer cell line)</td><td>GSM2827368, GSM2827369</td><td>251891733</td><td>168970500</td><td>130644353</td><td>Lung_Squamous_Cell_Carcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Jurkat (T lymphocyte cell line), control</td><td>GSM4005290</td><td>984723203</td><td>646579850</td><td>8175941</td><td>Malignant_Lymphoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Jurkat (T lymphocyte cell line), Inversion of -31kb CTCF binding site</td><td>GSM4005291</td><td>832680548</td><td>569846011</td><td>8807374</td><td>Malignant_Lymphoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T lymphocytes, DMSO treat</td><td>GSM2978427, GSM2978428</td><td>549135287</td><td>406470243</td><td>89371512</td><td>Malignant_Lymphoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>T lymphocytes, UNC4976 treat (PRC1 inhibitor)</td><td>GSM2978429, GSM2978430</td><td>633167638</td><td>453172588</td><td>136592418</td><td>Malignant_Lymphoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>CUTLL1 (T-ALL cell lines), 1_M DMSO treat every 12h for 72h, HindIII</td><td>GSM3967126, GSM3967127</td><td>605798532</td><td>458322653</td><td>328317192</td><td>Malignant_Lymphoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>CUTLL1 (T-ALL cell lines), 1_M DMSO treat every 12h for 72h treat, Arima</td><td>GSM3967131, GSM3967132</td><td>440148654</td><td>290573710</td><td>173621361</td><td>Malignant_Lymphoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Jurkat (T-ALL cell lines), 1_M DMSO treat every 12h for 72h</td><td>GSM3967128</td><td>293286388</td><td>218907550</td><td>161074818</td><td>Malignant_Lymphoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>CUTLL1 (T-ALL cell lines), 1_M _SI treat every 12 h for 72h</td><td>GSM3967129, GSM3967130</td><td>567807660</td><td>429902058</td><td>317043468</td><td>Malignant_Lymphoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>CUTLL1 (T-ALL cell lines), 100nM THZ1 treat every 12h for 24h</td><td>GSM3967133, GSM3967134</td><td>488711488</td><td>320350523</td><td>196790125</td><td>Malignant_Lymphoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>RMG1 (Ovarian clear cell adenocarcinoma cell line)</td><td>GSM3392700</td><td>112923390</td><td>86509129</td><td>61520686</td><td>Ovarian_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>RMG1 (Ovarian clear cell adenocarcinoma cell line), ARID1A Knock Out</td><td>GSM3392701, GSM3392702</td><td>415717991</td><td>313503399</td><td>82617964</td><td>Ovarian_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>RMG1 (Ovarian clear cell adenocarcinoma cell line), NCAPH2 knock Down</td><td>GSM3392703, GSM3392704</td><td>324744057</td><td>250619416</td><td>178653125</td><td>Ovarian_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Panc1 (pancreatic carcinoma cell line)</td><td>GSM2827313, GSM2827314</td><td>288978052</td><td>207022811</td><td>95287825</td><td>Pancreatic_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>22Rv1 (prostate cancer cell line)</td><td>GSM3358191, GSM3358192</td><td>1160817606</td><td>827336464</td><td>435540431</td><td>Prostate_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>LNCaP (prostate adenocarcinoma cell line)</td><td>GSM2827298, GSM2827299</td><td>306489193</td><td>201367841</td><td>140340910</td><td>Prostate_Adenocarcinoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>ACHN (renal cell adenocarcinoma cell line)</td><td>GSM2827296, GSM2827297</td><td>318594372</td><td>186275752</td><td>124002469</td><td>Renal_Cell_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Caki2 (Renal cancer cell line)</td><td>GSM2827127, GSM2827128</td><td>323731060</td><td>230583858</td><td>117665509</td><td>Renal_Cell_Cancer</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HT1080 (fibrosarcoma cell line)</td><td>GSM3304262, GSM3304264</td><td>459639289</td><td>290565017</td><td>91128189</td><td>Sarcoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>HT1080 (fibrosarcoma cell line), treat 3_m CBL0137(curaxin), 6hour</td><td>GSM3304263, GSM3304265</td><td>477264109</td><td>293928107</td><td>88614820</td><td>Sarcoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SJCRH30 (rhabdomyosarcoma cell line)</td><td>GSM2828914, GSM2828915</td><td>152235750</td><td>14521141</td><td>10061781</td><td>Sarcoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>RPMI-7951 (Skin Malignant Melanoma Cell line)</td><td>GSM2828922, GSM2828923</td><td>335883359</td><td>238065916</td><td>177726868</td><td>Skin_Cutaneous_melanoma</td><td>cancer Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-151N (Korean colorectal cancer patient tissue, paired-normal)</td><td>in-house</td><td>884920598</td><td>659322576</td><td>536474206</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-542N (Korean colorectal cancer patient tissue, paired-normal)</td><td>in-house</td><td>664606156</td><td>487362479</td><td>445020078</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-52N (Korean colorectal cancer patient tissue, paired-normal)</td><td>in-house</td><td>427338618</td><td>317768703</td><td>280699608</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_12-251N (Korean colorectal cancer patient tissue, paired-normal)</td><td>in-house</td><td>421661262</td><td>315148822</td><td>283218551</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-1074N (Korean colorectal cancer patient tissue, paired-normal)</td><td>in-house</td><td>422467745</td><td>316431115</td><td>279706985</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-63N (Korean colorectal cancer patient tissue, paired-normal)</td><td>in-house</td><td>421129540</td><td>310249164</td><td>281705261</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_11-51N (Korean colorectal cancer patient tissue, paired-normal)</td><td>in-house</td><td>386903406</td><td>278712486</td><td>265520456</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_13-731N (Korean colorectal cancer patient tissue, paired-normal)</td><td>in-house</td><td>410379473</td><td>301824636</td><td>259747589</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_16-178N (Korean colorectal cancer patient tissue, paired-normal)</td><td>in-house</td><td>432730343</td><td>317145590</td><td>281835009</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>SNUCRC_14-1251N (Korean colorectal cancer patient tissue, paired-normal)</td><td>in-house</td><td>886088033</td><td>669433528</td><td>551923980</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>WI38_RAF (WI-38hTERT/GFP-RAF1-ER), uninduced</td><td>GSM3735774, GSM3735775</td><td>881779242</td><td>648328824</td><td>216343943</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>WI38_RAF (WI-38hTERT/GFP-RAF1-ER), Oncogene induces senescence day2</td><td>GSM3735776, GSM3735777</td><td>883676690</td><td>646036417</td><td>332793503</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>WI38_RAF (WI-38hTERT/GFP-RAF1-ER), Oncogene induces senescence day4</td><td>GSM3735778, GSM3735779</td><td>882422192</td><td>644836721</td><td>398445428</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>WI38_RAF (WI-38hTERT/GFP-RAF1-ER), Oncogene induces senescence day6</td><td>GSM3735780, GSM3735781</td><td>882614218</td><td>630127410</td><td>437030479</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>WI38_RAF (WI-38hTERT/GFP-RAF1-ER), Oncogene induces senescence day10</td><td>GSM3735782, GSM3735783</td><td>883468687</td><td>655227988</td><td>403561929</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>WI38 Primary Fibrolabsts, replicative senescence - proliferative</td><td>GSM3735784, GSM3735785</td><td>883066011</td><td>638022950</td><td>344703900</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>WI38 Primary Fibrolabsts, replicative senescence - senescence</td><td>GSM3735786, GSM3735787</td><td>884354567</td><td>657051143</td><td>431130856</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>WI38_RAF (WI-38hTERT/GFP-RAF1-ER), Oncogene induces senescence day5, treat siDNMT1</td><td>GSM3735788, GSM3735789</td><td>498071418</td><td>351580282</td><td>313389599</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>WI38_RAF (WI-38hTERT/GFP-RAF1-ER), Oncogene induces senescence day5, treat siNT1</td><td>GSM3735790</td><td>265301308</td><td>211197944</td><td>173178837</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Primary CD4+ T-cells</td><td>GSM4119020, GSM4119025</td><td>441336765</td><td>326967611</td><td>229420799</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Primary CD4+ T-cells, CD3/CD28 stimulated, 20min</td><td>GSM4119021, GSM4119026</td><td>457097949</td><td>341339878</td><td>248371235</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Primary CD4+ T-cells, CD3/CD28 stimulated, 1hr</td><td>GSM4119022, GSM4119027</td><td>471820743</td><td>352237269</td><td>253395091</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Primary CD4+ T-cells, CD3/CD28 stimulated, 4hr</td><td>GSM4119023, GSM4119028</td><td>396495233</td><td>297996877</td><td>223291925</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Primary CD4+ T-cells, CD3/CD28 stimulated, 24hr</td><td>GSM4119024</td><td>227352705</td><td>170230000</td><td>128639498</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>IMR90 (Lung fibroblast-derived myoblast), control vector</td><td>GSM2597682, GSM2597683</td><td>1238966667</td><td>858991824</td><td>565423161</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>IMR90 (Lung fibroblast-derived myoblast), TET-inducible MYOD, Growth media</td><td>GSM2597684, GSM2597685</td><td>1441853252</td><td>1000879427</td><td>673810174</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>IMR90 (Lung fibroblast-derived myoblast), TET-inducible MYOD, differentiation media</td><td>GSM2597686, GSM2597687</td><td>1803932213</td><td>1238805865</td><td>866128695</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Peripheral blood T cells</td><td>GSM3967114</td><td>241953113</td><td>182004914</td><td>143471144</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Peripheral blood T cells</td><td>GSM3967115</td><td>101758893</td><td>75341149</td><td>59417144</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>Peripheral blood T cells</td><td>GSM3967116</td><td>227780622</td><td>156444898</td><td>98861174</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td>
</td></tr><tr><td>MCF10AT1 (hyperplastic breast cell)</td><td>GSM2599093, GSM2599094</td><td>428654193</td><td>298439062</td><td>138228509</td><td>Paired-normal</td><td>cancer matched normal Hi-C</td><td>hg38</td><td></td></tr></tbody></table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
	
<jsp:include page="../common/footer.jsp" flush="false"/>