/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/cypress-file-upload/dist/bundle.js":
/*!*********************************************************!*\
  !*** ./node_modules/cypress-file-upload/dist/bundle.js ***!
  \*********************************************************/
/***/ (() => {



const DEFAULT_PROCESSING_OPTIONS = Object.freeze({
  subjectType: 'input',
  force: false,
  allowEmpty: false
});
const SUBJECT_TYPE = Object.freeze({
  INPUT: 'input',
  DRAG_N_DROP: 'drag-n-drop'
});
const EVENTS_BY_SUBJECT_TYPE = {
  [SUBJECT_TYPE.INPUT]: ['change'],

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
   */
  [SUBJECT_TYPE.DRAG_N_DROP]: ['dragstart', 'drag', 'dragenter', 'drop', 'dragleave', 'dragend']
};

/**
 * @description dispatches custom event with dataTransfer object provided
 *
 * @param {HTMLElement} target
 * @param {string} event
 * @param {DataTransfer} dataTransfer
 */
function dispatchEvent(target, event, dataTransfer) {
  const eventPayload = {
    bubbles: true,
    cancelable: true,
    detail: dataTransfer
  };

  try {
    const e = new CustomEvent(event, eventPayload);
    Object.assign(e, {
      dataTransfer
    });
    target.dispatchEvent(e);
  } catch (e) {// make sure event triggering won't break if subject element is not visible or in DOM anymore
  }
}

/**
 * @description determines if element is visible in DOM
 *
 * @param {Cypress.Subject} element
 * @returns {Boolean}
 */
function isElementVisible(element) {
  if (!element) {
    throw new Error('Element cannot be empty');
  }
  /* running isVisible command on detached element throws an error */


  return Cypress.dom.isAttached(element) && Cypress.dom.isVisible(element);
}

/**
 * @description determines if element is visible in DOM
 *
 * @param {Cypress.Subject} element
 * @returns {Boolean}
 */
function isShadowElement(element) {
  if (!element) {
    throw new Error('Element cannot be empty');
  }

  return Cypress.dom.isDetached(element);
}

const BROWSER_CHROME = 'chrome';
function isManualEventHandling() {
  const {
    name,
    majorVersion
  } = Cypress.browser;

  if (name === BROWSER_CHROME && majorVersion < 73) {
    /**
     * Chrome <73 triggers 'change' event automatically
     * https://github.com/abramenal/cypress-file-upload/issues/34
     */
    return false;
  }

  return true;
}

const BROWSER_FIREFOX = 'firefox';
function isBrowserFirefox() {
  const {
    name
  } = Cypress.browser;
  return name === BROWSER_FIREFOX;
}

function dispatchEvents(element, events, dataTransfer) {
  events.forEach(event => {
    dispatchEvent(element, event, dataTransfer);
  });
}

function getEventsBySubjectType(subjectType) {
  const events = EVENTS_BY_SUBJECT_TYPE[subjectType];
  /**
   * @see https://github.com/abramenal/cypress-file-upload/issues/293
   */

  if (subjectType === SUBJECT_TYPE.DRAG_N_DROP && isBrowserFirefox()) {
    events.push('change');
  }

  return events;
}

function attachFileToElement(subject, {
  files,
  subjectType,
  force,
  window
}) {
  const dataTransfer = new window.DataTransfer();
  files.forEach(f => dataTransfer.items.add(f));

  if (subjectType === SUBJECT_TYPE.INPUT) {
    const inputElement = subject[0];
    inputElement.files = dataTransfer.files;

    if (force) {
      dispatchEvents(inputElement, getEventsBySubjectType(subjectType), dataTransfer);
    }
  } else if (subjectType === SUBJECT_TYPE.DRAG_N_DROP) {
    const inputElements = subject[0].querySelectorAll('input[type="file"]');
    /**
     * Try to find underlying file input element, as likely drag-n-drop component uses it internally
     * Otherwise dispatch all events on subject element
     */

    if (inputElements.length === 1) {
      const inputElement = inputElements[0];
      inputElement.files = dataTransfer.files;

      if (force) {
        dispatchEvents(inputElement, getEventsBySubjectType(subjectType), dataTransfer);
      }
    } else {
      const inputElement = subject[0];
      inputElement.files = dataTransfer.files;

      if (force) {
        dispatchEvents(inputElement, getEventsBySubjectType(subjectType), dataTransfer);
      }
    }
  }
}

const ENCODING = Object.freeze({
  ASCII: 'ascii',
  BASE64: 'base64',
  BINARY: 'binary',
  HEX: 'hex',
  LATIN1: 'latin1',
  UTF8: 'utf8',
  UTF_8: 'utf-8',
  UCS2: 'ucs2',
  UCS_2: 'ucs-2',
  UTF16LE: 'utf16le',
  UTF_16LE: 'utf-16le'
});
const FILE_EXTENSION = Object.freeze({
  JSON: 'json',
  JS: 'js',
  COFFEE: 'coffee',
  HTML: 'html',
  TXT: 'txt',
  CSV: 'csv',
  PNG: 'png',
  JPG: 'jpg',
  JPEG: 'jpeg',
  GIF: 'gif',
  TIF: 'tif',
  TIFF: 'tiff',
  ZIP: 'zip',
  PDF: 'pdf',
  VCF: 'vcf',
  SVG: 'svg',
  XLS: 'xls',
  XLSX: 'xlsx',
  DOC: 'doc',
  DOCX: 'docx',
  MP3: 'mp3'
});

const wrapBlob = blob => {
  // Cypress version 5 assigns a function with a compatibility warning
  // to blob.then, but that makes the Blob actually thenable. We have
  // to remove that to Promise.resolve not treat it as thenable.
  if (blob instanceof Cypress.Promise) {
    return blob;
  } // eslint-disable-next-line no-param-reassign


  delete blob.then;
  return Cypress.Promise.resolve(blob);
};

function getFileExt(filePath) {
  if (!filePath) {
    return '';
  }

  const pos = filePath.lastIndexOf('.');

  if (pos === -1) {
    return '';
  }

  return filePath.slice(pos + 1);
}

const ENCODING_TO_BLOB_GETTER = {
  [ENCODING.ASCII]: fileContent => Cypress.Promise.resolve(fileContent),
  [ENCODING.BASE64]: (fileContent, mimeType) => wrapBlob(Cypress.Blob.base64StringToBlob(fileContent, mimeType)),
  [ENCODING.BINARY]: (fileContent, mimeType) => wrapBlob(Cypress.Blob.binaryStringToBlob(fileContent, mimeType)),
  [ENCODING.HEX]: fileContent => Cypress.Promise.resolve(fileContent),
  [ENCODING.LATIN1]: fileContent => Cypress.Promise.resolve(fileContent),
  [ENCODING.UTF8]: fileContent => Cypress.Promise.resolve(fileContent),
  [ENCODING.UTF_8]: fileContent => Cypress.Promise.resolve(fileContent),
  [ENCODING.UCS2]: fileContent => Cypress.Promise.resolve(fileContent),
  [ENCODING.UCS_2]: fileContent => Cypress.Promise.resolve(fileContent),
  [ENCODING.UTF16LE]: fileContent => Cypress.Promise.resolve(fileContent),
  [ENCODING.UTF_16LE]: fileContent => Cypress.Promise.resolve(fileContent)
};
function getFileBlobAsync({
  fileName,
  fileContent,
  mimeType,
  encoding,
  window,
  lastModified
}) {
  const getBlob = ENCODING_TO_BLOB_GETTER[encoding];
  return getBlob(fileContent, mimeType).then(blob => {
    let blobContent = blob; // https://github.com/abramenal/cypress-file-upload/issues/175

    if (getFileExt(fileName) === FILE_EXTENSION.JSON) {
      blobContent = JSON.stringify(fileContent, null, 2);
    } // we must use the file constructor from the subject window so this check `file instanceof File`, can pass


    const file = new window.File([blobContent], fileName, {
      type: mimeType,
      lastModified
    });
    return file;
  });
}

function getFileContent({
  filePath,
  fileContent,
  fileEncoding
}) {
  // allows users to provide file content.
  if (fileContent) {
    return wrapBlob(fileContent);
  }

  return Cypress.cy.fixture(filePath, fileEncoding);
}

/*
 * Copied from https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/fixture.coffee#L104
 */

const EXTENSION_TO_ENCODING = {
  [FILE_EXTENSION.JSON]: ENCODING.UTF8,
  [FILE_EXTENSION.JS]: ENCODING.UTF8,
  [FILE_EXTENSION.COFFEE]: ENCODING.UTF8,
  [FILE_EXTENSION.HTML]: ENCODING.UTF8,
  [FILE_EXTENSION.TXT]: ENCODING.UTF8,
  [FILE_EXTENSION.CSV]: ENCODING.UTF8,
  [FILE_EXTENSION.PNG]: ENCODING.BASE64,
  [FILE_EXTENSION.JPG]: ENCODING.BASE64,
  [FILE_EXTENSION.JPEG]: ENCODING.BASE64,
  [FILE_EXTENSION.GIF]: ENCODING.BASE64,
  [FILE_EXTENSION.TIF]: ENCODING.BASE64,
  [FILE_EXTENSION.TIFF]: ENCODING.BASE64,
  [FILE_EXTENSION.ZIP]: ENCODING.BASE64,

  /*
   * Other extensions that are not supported by cy.fixture by default:
   */
  [FILE_EXTENSION.PDF]: ENCODING.UTF8,
  [FILE_EXTENSION.VCF]: ENCODING.UTF8,
  [FILE_EXTENSION.SVG]: ENCODING.UTF8,
  [FILE_EXTENSION.XLS]: ENCODING.BINARY,
  [FILE_EXTENSION.XLSX]: ENCODING.BINARY,
  [FILE_EXTENSION.DOC]: ENCODING.BINARY,
  [FILE_EXTENSION.DOCX]: ENCODING.BINARY,
  [FILE_EXTENSION.MP3]: ENCODING.BINARY
};
const DEFAULT_ENCODING = ENCODING.UTF8;
function getFileEncoding(filePath) {
  const extension = getFileExt(filePath);
  const encoding = EXTENSION_TO_ENCODING[extension];
  return encoding || DEFAULT_ENCODING;
}

/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (let i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }

  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
Mime.prototype.define = function(typeMap, force) {
  for (let type in typeMap) {
    let extensions = typeMap[type].map(function(t) {
      return t.toLowerCase();
    });
    type = type.toLowerCase();

    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] === '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      const ext = extensions[0];
      this._extensions[type] = (ext[0] !== '*') ? ext : ext.substr(1);
    }
  }
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.getType = function(path) {
  path = String(path);
  let last = path.replace(/^.*[/\\]/, '').toLowerCase();
  let ext = last.replace(/^.*\./, '').toLowerCase();

  let hasPath = last.length < path.length;
  let hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

var Mime_1 = Mime;

var standard = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomdeleted+xml":["atomdeleted"],"application/atomsvc+xml":["atomsvc"],"application/atsc-dwd+xml":["dwd"],"application/atsc-held+xml":["held"],"application/atsc-rsat+xml":["rsat"],"application/bdoc":["bdoc"],"application/calendar+xml":["xcs"],"application/ccxml+xml":["ccxml"],"application/cdfx+xml":["cdfx"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/emotionml+xml":["emotionml"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/fdt+xml":["fdt"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/its+xml":["its"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lgr+xml":["lgr"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mmt-aei+xml":["maei"],"application/mmt-usd+xml":["musd"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/mrb-consumer+xml":["*xdf"],"application/mrb-publish+xml":["*xdf"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/node":["cjs"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/p2p-overlay+xml":["relo"],"application/patch-ops-error+xml":["*xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/provenance+xml":["provx"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/route-apd+xml":["rapd"],"application/route-s-tsid+xml":["sls"],"application/route-usd+xml":["rusd"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/senml+xml":["senmlx"],"application/sensml+xml":["sensmlx"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/swid+xml":["swidtag"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/toml":["toml"],"application/ttml+xml":["ttml"],"application/ubjson":["ubj"],"application/urc-ressheet+xml":["rsheet"],"application/urc-targetdesc+xml":["td"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-att+xml":["xav"],"application/xcap-caps+xml":["xca"],"application/xcap-diff+xml":["xdf"],"application/xcap-el+xml":["xel"],"application/xcap-error+xml":["xer"],"application/xcap-ns+xml":["xns"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xliff+xml":["xlf"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["*xsl","xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mobile-xmf":["mxmf"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/avif":["avif"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/hej2k":["hej2"],"image/hsj2":["hsj2"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jph":["jph"],"image/jphc":["jhc"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/jxra":["jxra"],"image/jxrs":["jxrs"],"image/jxs":["jxs"],"image/jxsc":["jxsc"],"image/jxsi":["jxsi"],"image/jxss":["jxss"],"image/ktx":["ktx"],"image/ktx2":["ktx2"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/mtl":["mtl"],"model/obj":["obj"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/spdx":["spdx"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

var other = {"application/prs.cww":["cww"],"application/vnd.1000minds.decision-model+xml":["1km"],"application/vnd.3gpp.pic-bw-large":["plb"],"application/vnd.3gpp.pic-bw-small":["psb"],"application/vnd.3gpp.pic-bw-var":["pvb"],"application/vnd.3gpp2.tcap":["tcap"],"application/vnd.3m.post-it-notes":["pwn"],"application/vnd.accpac.simply.aso":["aso"],"application/vnd.accpac.simply.imp":["imp"],"application/vnd.acucobol":["acu"],"application/vnd.acucorp":["atc","acutc"],"application/vnd.adobe.air-application-installer-package+zip":["air"],"application/vnd.adobe.formscentral.fcdt":["fcdt"],"application/vnd.adobe.fxp":["fxp","fxpl"],"application/vnd.adobe.xdp+xml":["xdp"],"application/vnd.adobe.xfdf":["xfdf"],"application/vnd.ahead.space":["ahead"],"application/vnd.airzip.filesecure.azf":["azf"],"application/vnd.airzip.filesecure.azs":["azs"],"application/vnd.amazon.ebook":["azw"],"application/vnd.americandynamics.acc":["acc"],"application/vnd.amiga.ami":["ami"],"application/vnd.android.package-archive":["apk"],"application/vnd.anser-web-certificate-issue-initiation":["cii"],"application/vnd.anser-web-funds-transfer-initiation":["fti"],"application/vnd.antix.game-component":["atx"],"application/vnd.apple.installer+xml":["mpkg"],"application/vnd.apple.keynote":["key"],"application/vnd.apple.mpegurl":["m3u8"],"application/vnd.apple.numbers":["numbers"],"application/vnd.apple.pages":["pages"],"application/vnd.apple.pkpass":["pkpass"],"application/vnd.aristanetworks.swi":["swi"],"application/vnd.astraea-software.iota":["iota"],"application/vnd.audiograph":["aep"],"application/vnd.balsamiq.bmml+xml":["bmml"],"application/vnd.blueice.multipass":["mpm"],"application/vnd.bmi":["bmi"],"application/vnd.businessobjects":["rep"],"application/vnd.chemdraw+xml":["cdxml"],"application/vnd.chipnuts.karaoke-mmd":["mmd"],"application/vnd.cinderella":["cdy"],"application/vnd.citationstyles.style+xml":["csl"],"application/vnd.claymore":["cla"],"application/vnd.cloanto.rp9":["rp9"],"application/vnd.clonk.c4group":["c4g","c4d","c4f","c4p","c4u"],"application/vnd.cluetrust.cartomobile-config":["c11amc"],"application/vnd.cluetrust.cartomobile-config-pkg":["c11amz"],"application/vnd.commonspace":["csp"],"application/vnd.contact.cmsg":["cdbcmsg"],"application/vnd.cosmocaller":["cmc"],"application/vnd.crick.clicker":["clkx"],"application/vnd.crick.clicker.keyboard":["clkk"],"application/vnd.crick.clicker.palette":["clkp"],"application/vnd.crick.clicker.template":["clkt"],"application/vnd.crick.clicker.wordbank":["clkw"],"application/vnd.criticaltools.wbs+xml":["wbs"],"application/vnd.ctc-posml":["pml"],"application/vnd.cups-ppd":["ppd"],"application/vnd.curl.car":["car"],"application/vnd.curl.pcurl":["pcurl"],"application/vnd.dart":["dart"],"application/vnd.data-vision.rdz":["rdz"],"application/vnd.dbf":["dbf"],"application/vnd.dece.data":["uvf","uvvf","uvd","uvvd"],"application/vnd.dece.ttml+xml":["uvt","uvvt"],"application/vnd.dece.unspecified":["uvx","uvvx"],"application/vnd.dece.zip":["uvz","uvvz"],"application/vnd.denovo.fcselayout-link":["fe_launch"],"application/vnd.dna":["dna"],"application/vnd.dolby.mlp":["mlp"],"application/vnd.dpgraph":["dpg"],"application/vnd.dreamfactory":["dfac"],"application/vnd.ds-keypoint":["kpxx"],"application/vnd.dvb.ait":["ait"],"application/vnd.dvb.service":["svc"],"application/vnd.dynageo":["geo"],"application/vnd.ecowin.chart":["mag"],"application/vnd.enliven":["nml"],"application/vnd.epson.esf":["esf"],"application/vnd.epson.msf":["msf"],"application/vnd.epson.quickanime":["qam"],"application/vnd.epson.salt":["slt"],"application/vnd.epson.ssf":["ssf"],"application/vnd.eszigno3+xml":["es3","et3"],"application/vnd.ezpix-album":["ez2"],"application/vnd.ezpix-package":["ez3"],"application/vnd.fdf":["fdf"],"application/vnd.fdsn.mseed":["mseed"],"application/vnd.fdsn.seed":["seed","dataless"],"application/vnd.flographit":["gph"],"application/vnd.fluxtime.clip":["ftc"],"application/vnd.framemaker":["fm","frame","maker","book"],"application/vnd.frogans.fnc":["fnc"],"application/vnd.frogans.ltf":["ltf"],"application/vnd.fsc.weblaunch":["fsc"],"application/vnd.fujitsu.oasys":["oas"],"application/vnd.fujitsu.oasys2":["oa2"],"application/vnd.fujitsu.oasys3":["oa3"],"application/vnd.fujitsu.oasysgp":["fg5"],"application/vnd.fujitsu.oasysprs":["bh2"],"application/vnd.fujixerox.ddd":["ddd"],"application/vnd.fujixerox.docuworks":["xdw"],"application/vnd.fujixerox.docuworks.binder":["xbd"],"application/vnd.fuzzysheet":["fzs"],"application/vnd.genomatix.tuxedo":["txd"],"application/vnd.geogebra.file":["ggb"],"application/vnd.geogebra.tool":["ggt"],"application/vnd.geometry-explorer":["gex","gre"],"application/vnd.geonext":["gxt"],"application/vnd.geoplan":["g2w"],"application/vnd.geospace":["g3w"],"application/vnd.gmx":["gmx"],"application/vnd.google-apps.document":["gdoc"],"application/vnd.google-apps.presentation":["gslides"],"application/vnd.google-apps.spreadsheet":["gsheet"],"application/vnd.google-earth.kml+xml":["kml"],"application/vnd.google-earth.kmz":["kmz"],"application/vnd.grafeq":["gqf","gqs"],"application/vnd.groove-account":["gac"],"application/vnd.groove-help":["ghf"],"application/vnd.groove-identity-message":["gim"],"application/vnd.groove-injector":["grv"],"application/vnd.groove-tool-message":["gtm"],"application/vnd.groove-tool-template":["tpl"],"application/vnd.groove-vcard":["vcg"],"application/vnd.hal+xml":["hal"],"application/vnd.handheld-entertainment+xml":["zmm"],"application/vnd.hbci":["hbci"],"application/vnd.hhe.lesson-player":["les"],"application/vnd.hp-hpgl":["hpgl"],"application/vnd.hp-hpid":["hpid"],"application/vnd.hp-hps":["hps"],"application/vnd.hp-jlyt":["jlt"],"application/vnd.hp-pcl":["pcl"],"application/vnd.hp-pclxl":["pclxl"],"application/vnd.hydrostatix.sof-data":["sfd-hdstx"],"application/vnd.ibm.minipay":["mpy"],"application/vnd.ibm.modcap":["afp","listafp","list3820"],"application/vnd.ibm.rights-management":["irm"],"application/vnd.ibm.secure-container":["sc"],"application/vnd.iccprofile":["icc","icm"],"application/vnd.igloader":["igl"],"application/vnd.immervision-ivp":["ivp"],"application/vnd.immervision-ivu":["ivu"],"application/vnd.insors.igm":["igm"],"application/vnd.intercon.formnet":["xpw","xpx"],"application/vnd.intergeo":["i2g"],"application/vnd.intu.qbo":["qbo"],"application/vnd.intu.qfx":["qfx"],"application/vnd.ipunplugged.rcprofile":["rcprofile"],"application/vnd.irepository.package+xml":["irp"],"application/vnd.is-xpr":["xpr"],"application/vnd.isac.fcs":["fcs"],"application/vnd.jam":["jam"],"application/vnd.jcp.javame.midlet-rms":["rms"],"application/vnd.jisp":["jisp"],"application/vnd.joost.joda-archive":["joda"],"application/vnd.kahootz":["ktz","ktr"],"application/vnd.kde.karbon":["karbon"],"application/vnd.kde.kchart":["chrt"],"application/vnd.kde.kformula":["kfo"],"application/vnd.kde.kivio":["flw"],"application/vnd.kde.kontour":["kon"],"application/vnd.kde.kpresenter":["kpr","kpt"],"application/vnd.kde.kspread":["ksp"],"application/vnd.kde.kword":["kwd","kwt"],"application/vnd.kenameaapp":["htke"],"application/vnd.kidspiration":["kia"],"application/vnd.kinar":["kne","knp"],"application/vnd.koan":["skp","skd","skt","skm"],"application/vnd.kodak-descriptor":["sse"],"application/vnd.las.las+xml":["lasxml"],"application/vnd.llamagraphics.life-balance.desktop":["lbd"],"application/vnd.llamagraphics.life-balance.exchange+xml":["lbe"],"application/vnd.lotus-1-2-3":["123"],"application/vnd.lotus-approach":["apr"],"application/vnd.lotus-freelance":["pre"],"application/vnd.lotus-notes":["nsf"],"application/vnd.lotus-organizer":["org"],"application/vnd.lotus-screencam":["scm"],"application/vnd.lotus-wordpro":["lwp"],"application/vnd.macports.portpkg":["portpkg"],"application/vnd.mcd":["mcd"],"application/vnd.medcalcdata":["mc1"],"application/vnd.mediastation.cdkey":["cdkey"],"application/vnd.mfer":["mwf"],"application/vnd.mfmp":["mfm"],"application/vnd.micrografx.flo":["flo"],"application/vnd.micrografx.igx":["igx"],"application/vnd.mif":["mif"],"application/vnd.mobius.daf":["daf"],"application/vnd.mobius.dis":["dis"],"application/vnd.mobius.mbk":["mbk"],"application/vnd.mobius.mqy":["mqy"],"application/vnd.mobius.msl":["msl"],"application/vnd.mobius.plc":["plc"],"application/vnd.mobius.txf":["txf"],"application/vnd.mophun.application":["mpn"],"application/vnd.mophun.certificate":["mpc"],"application/vnd.mozilla.xul+xml":["xul"],"application/vnd.ms-artgalry":["cil"],"application/vnd.ms-cab-compressed":["cab"],"application/vnd.ms-excel":["xls","xlm","xla","xlc","xlt","xlw"],"application/vnd.ms-excel.addin.macroenabled.12":["xlam"],"application/vnd.ms-excel.sheet.binary.macroenabled.12":["xlsb"],"application/vnd.ms-excel.sheet.macroenabled.12":["xlsm"],"application/vnd.ms-excel.template.macroenabled.12":["xltm"],"application/vnd.ms-fontobject":["eot"],"application/vnd.ms-htmlhelp":["chm"],"application/vnd.ms-ims":["ims"],"application/vnd.ms-lrm":["lrm"],"application/vnd.ms-officetheme":["thmx"],"application/vnd.ms-outlook":["msg"],"application/vnd.ms-pki.seccat":["cat"],"application/vnd.ms-pki.stl":["*stl"],"application/vnd.ms-powerpoint":["ppt","pps","pot"],"application/vnd.ms-powerpoint.addin.macroenabled.12":["ppam"],"application/vnd.ms-powerpoint.presentation.macroenabled.12":["pptm"],"application/vnd.ms-powerpoint.slide.macroenabled.12":["sldm"],"application/vnd.ms-powerpoint.slideshow.macroenabled.12":["ppsm"],"application/vnd.ms-powerpoint.template.macroenabled.12":["potm"],"application/vnd.ms-project":["mpp","mpt"],"application/vnd.ms-word.document.macroenabled.12":["docm"],"application/vnd.ms-word.template.macroenabled.12":["dotm"],"application/vnd.ms-works":["wps","wks","wcm","wdb"],"application/vnd.ms-wpl":["wpl"],"application/vnd.ms-xpsdocument":["xps"],"application/vnd.mseq":["mseq"],"application/vnd.musician":["mus"],"application/vnd.muvee.style":["msty"],"application/vnd.mynfc":["taglet"],"application/vnd.neurolanguage.nlu":["nlu"],"application/vnd.nitf":["ntf","nitf"],"application/vnd.noblenet-directory":["nnd"],"application/vnd.noblenet-sealer":["nns"],"application/vnd.noblenet-web":["nnw"],"application/vnd.nokia.n-gage.ac+xml":["*ac"],"application/vnd.nokia.n-gage.data":["ngdat"],"application/vnd.nokia.n-gage.symbian.install":["n-gage"],"application/vnd.nokia.radio-preset":["rpst"],"application/vnd.nokia.radio-presets":["rpss"],"application/vnd.novadigm.edm":["edm"],"application/vnd.novadigm.edx":["edx"],"application/vnd.novadigm.ext":["ext"],"application/vnd.oasis.opendocument.chart":["odc"],"application/vnd.oasis.opendocument.chart-template":["otc"],"application/vnd.oasis.opendocument.database":["odb"],"application/vnd.oasis.opendocument.formula":["odf"],"application/vnd.oasis.opendocument.formula-template":["odft"],"application/vnd.oasis.opendocument.graphics":["odg"],"application/vnd.oasis.opendocument.graphics-template":["otg"],"application/vnd.oasis.opendocument.image":["odi"],"application/vnd.oasis.opendocument.image-template":["oti"],"application/vnd.oasis.opendocument.presentation":["odp"],"application/vnd.oasis.opendocument.presentation-template":["otp"],"application/vnd.oasis.opendocument.spreadsheet":["ods"],"application/vnd.oasis.opendocument.spreadsheet-template":["ots"],"application/vnd.oasis.opendocument.text":["odt"],"application/vnd.oasis.opendocument.text-master":["odm"],"application/vnd.oasis.opendocument.text-template":["ott"],"application/vnd.oasis.opendocument.text-web":["oth"],"application/vnd.olpc-sugar":["xo"],"application/vnd.oma.dd2+xml":["dd2"],"application/vnd.openblox.game+xml":["obgx"],"application/vnd.openofficeorg.extension":["oxt"],"application/vnd.openstreetmap.data+xml":["osm"],"application/vnd.openxmlformats-officedocument.presentationml.presentation":["pptx"],"application/vnd.openxmlformats-officedocument.presentationml.slide":["sldx"],"application/vnd.openxmlformats-officedocument.presentationml.slideshow":["ppsx"],"application/vnd.openxmlformats-officedocument.presentationml.template":["potx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":["xlsx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.template":["xltx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":["docx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.template":["dotx"],"application/vnd.osgeo.mapguide.package":["mgp"],"application/vnd.osgi.dp":["dp"],"application/vnd.osgi.subsystem":["esa"],"application/vnd.palm":["pdb","pqa","oprc"],"application/vnd.pawaafile":["paw"],"application/vnd.pg.format":["str"],"application/vnd.pg.osasli":["ei6"],"application/vnd.picsel":["efif"],"application/vnd.pmi.widget":["wg"],"application/vnd.pocketlearn":["plf"],"application/vnd.powerbuilder6":["pbd"],"application/vnd.previewsystems.box":["box"],"application/vnd.proteus.magazine":["mgz"],"application/vnd.publishare-delta-tree":["qps"],"application/vnd.pvi.ptid1":["ptid"],"application/vnd.quark.quarkxpress":["qxd","qxt","qwd","qwt","qxl","qxb"],"application/vnd.rar":["rar"],"application/vnd.realvnc.bed":["bed"],"application/vnd.recordare.musicxml":["mxl"],"application/vnd.recordare.musicxml+xml":["musicxml"],"application/vnd.rig.cryptonote":["cryptonote"],"application/vnd.rim.cod":["cod"],"application/vnd.rn-realmedia":["rm"],"application/vnd.rn-realmedia-vbr":["rmvb"],"application/vnd.route66.link66+xml":["link66"],"application/vnd.sailingtracker.track":["st"],"application/vnd.seemail":["see"],"application/vnd.sema":["sema"],"application/vnd.semd":["semd"],"application/vnd.semf":["semf"],"application/vnd.shana.informed.formdata":["ifm"],"application/vnd.shana.informed.formtemplate":["itp"],"application/vnd.shana.informed.interchange":["iif"],"application/vnd.shana.informed.package":["ipk"],"application/vnd.simtech-mindmapper":["twd","twds"],"application/vnd.smaf":["mmf"],"application/vnd.smart.teacher":["teacher"],"application/vnd.software602.filler.form+xml":["fo"],"application/vnd.solent.sdkm+xml":["sdkm","sdkd"],"application/vnd.spotfire.dxp":["dxp"],"application/vnd.spotfire.sfs":["sfs"],"application/vnd.stardivision.calc":["sdc"],"application/vnd.stardivision.draw":["sda"],"application/vnd.stardivision.impress":["sdd"],"application/vnd.stardivision.math":["smf"],"application/vnd.stardivision.writer":["sdw","vor"],"application/vnd.stardivision.writer-global":["sgl"],"application/vnd.stepmania.package":["smzip"],"application/vnd.stepmania.stepchart":["sm"],"application/vnd.sun.wadl+xml":["wadl"],"application/vnd.sun.xml.calc":["sxc"],"application/vnd.sun.xml.calc.template":["stc"],"application/vnd.sun.xml.draw":["sxd"],"application/vnd.sun.xml.draw.template":["std"],"application/vnd.sun.xml.impress":["sxi"],"application/vnd.sun.xml.impress.template":["sti"],"application/vnd.sun.xml.math":["sxm"],"application/vnd.sun.xml.writer":["sxw"],"application/vnd.sun.xml.writer.global":["sxg"],"application/vnd.sun.xml.writer.template":["stw"],"application/vnd.sus-calendar":["sus","susp"],"application/vnd.svd":["svd"],"application/vnd.symbian.install":["sis","sisx"],"application/vnd.syncml+xml":["xsm"],"application/vnd.syncml.dm+wbxml":["bdm"],"application/vnd.syncml.dm+xml":["xdm"],"application/vnd.syncml.dmddf+xml":["ddf"],"application/vnd.tao.intent-module-archive":["tao"],"application/vnd.tcpdump.pcap":["pcap","cap","dmp"],"application/vnd.tmobile-livetv":["tmo"],"application/vnd.trid.tpt":["tpt"],"application/vnd.triscape.mxs":["mxs"],"application/vnd.trueapp":["tra"],"application/vnd.ufdl":["ufd","ufdl"],"application/vnd.uiq.theme":["utz"],"application/vnd.umajin":["umj"],"application/vnd.unity":["unityweb"],"application/vnd.uoml+xml":["uoml"],"application/vnd.vcx":["vcx"],"application/vnd.visio":["vsd","vst","vss","vsw"],"application/vnd.visionary":["vis"],"application/vnd.vsf":["vsf"],"application/vnd.wap.wbxml":["wbxml"],"application/vnd.wap.wmlc":["wmlc"],"application/vnd.wap.wmlscriptc":["wmlsc"],"application/vnd.webturbo":["wtb"],"application/vnd.wolfram.player":["nbp"],"application/vnd.wordperfect":["wpd"],"application/vnd.wqd":["wqd"],"application/vnd.wt.stf":["stf"],"application/vnd.xara":["xar"],"application/vnd.xfdl":["xfdl"],"application/vnd.yamaha.hv-dic":["hvd"],"application/vnd.yamaha.hv-script":["hvs"],"application/vnd.yamaha.hv-voice":["hvp"],"application/vnd.yamaha.openscoreformat":["osf"],"application/vnd.yamaha.openscoreformat.osfpvg+xml":["osfpvg"],"application/vnd.yamaha.smaf-audio":["saf"],"application/vnd.yamaha.smaf-phrase":["spf"],"application/vnd.yellowriver-custom-menu":["cmp"],"application/vnd.zul":["zir","zirz"],"application/vnd.zzazz.deck+xml":["zaz"],"application/x-7z-compressed":["7z"],"application/x-abiword":["abw"],"application/x-ace-compressed":["ace"],"application/x-apple-diskimage":["*dmg"],"application/x-arj":["arj"],"application/x-authorware-bin":["aab","x32","u32","vox"],"application/x-authorware-map":["aam"],"application/x-authorware-seg":["aas"],"application/x-bcpio":["bcpio"],"application/x-bdoc":["*bdoc"],"application/x-bittorrent":["torrent"],"application/x-blorb":["blb","blorb"],"application/x-bzip":["bz"],"application/x-bzip2":["bz2","boz"],"application/x-cbr":["cbr","cba","cbt","cbz","cb7"],"application/x-cdlink":["vcd"],"application/x-cfs-compressed":["cfs"],"application/x-chat":["chat"],"application/x-chess-pgn":["pgn"],"application/x-chrome-extension":["crx"],"application/x-cocoa":["cco"],"application/x-conference":["nsc"],"application/x-cpio":["cpio"],"application/x-csh":["csh"],"application/x-debian-package":["*deb","udeb"],"application/x-dgc-compressed":["dgc"],"application/x-director":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"],"application/x-doom":["wad"],"application/x-dtbncx+xml":["ncx"],"application/x-dtbook+xml":["dtb"],"application/x-dtbresource+xml":["res"],"application/x-dvi":["dvi"],"application/x-envoy":["evy"],"application/x-eva":["eva"],"application/x-font-bdf":["bdf"],"application/x-font-ghostscript":["gsf"],"application/x-font-linux-psf":["psf"],"application/x-font-pcf":["pcf"],"application/x-font-snf":["snf"],"application/x-font-type1":["pfa","pfb","pfm","afm"],"application/x-freearc":["arc"],"application/x-futuresplash":["spl"],"application/x-gca-compressed":["gca"],"application/x-glulx":["ulx"],"application/x-gnumeric":["gnumeric"],"application/x-gramps-xml":["gramps"],"application/x-gtar":["gtar"],"application/x-hdf":["hdf"],"application/x-httpd-php":["php"],"application/x-install-instructions":["install"],"application/x-iso9660-image":["*iso"],"application/x-java-archive-diff":["jardiff"],"application/x-java-jnlp-file":["jnlp"],"application/x-keepass2":["kdbx"],"application/x-latex":["latex"],"application/x-lua-bytecode":["luac"],"application/x-lzh-compressed":["lzh","lha"],"application/x-makeself":["run"],"application/x-mie":["mie"],"application/x-mobipocket-ebook":["prc","mobi"],"application/x-ms-application":["application"],"application/x-ms-shortcut":["lnk"],"application/x-ms-wmd":["wmd"],"application/x-ms-wmz":["wmz"],"application/x-ms-xbap":["xbap"],"application/x-msaccess":["mdb"],"application/x-msbinder":["obd"],"application/x-mscardfile":["crd"],"application/x-msclip":["clp"],"application/x-msdos-program":["*exe"],"application/x-msdownload":["*exe","*dll","com","bat","*msi"],"application/x-msmediaview":["mvb","m13","m14"],"application/x-msmetafile":["*wmf","*wmz","*emf","emz"],"application/x-msmoney":["mny"],"application/x-mspublisher":["pub"],"application/x-msschedule":["scd"],"application/x-msterminal":["trm"],"application/x-mswrite":["wri"],"application/x-netcdf":["nc","cdf"],"application/x-ns-proxy-autoconfig":["pac"],"application/x-nzb":["nzb"],"application/x-perl":["pl","pm"],"application/x-pilot":["*prc","*pdb"],"application/x-pkcs12":["p12","pfx"],"application/x-pkcs7-certificates":["p7b","spc"],"application/x-pkcs7-certreqresp":["p7r"],"application/x-rar-compressed":["*rar"],"application/x-redhat-package-manager":["rpm"],"application/x-research-info-systems":["ris"],"application/x-sea":["sea"],"application/x-sh":["sh"],"application/x-shar":["shar"],"application/x-shockwave-flash":["swf"],"application/x-silverlight-app":["xap"],"application/x-sql":["sql"],"application/x-stuffit":["sit"],"application/x-stuffitx":["sitx"],"application/x-subrip":["srt"],"application/x-sv4cpio":["sv4cpio"],"application/x-sv4crc":["sv4crc"],"application/x-t3vm-image":["t3"],"application/x-tads":["gam"],"application/x-tar":["tar"],"application/x-tcl":["tcl","tk"],"application/x-tex":["tex"],"application/x-tex-tfm":["tfm"],"application/x-texinfo":["texinfo","texi"],"application/x-tgif":["*obj"],"application/x-ustar":["ustar"],"application/x-virtualbox-hdd":["hdd"],"application/x-virtualbox-ova":["ova"],"application/x-virtualbox-ovf":["ovf"],"application/x-virtualbox-vbox":["vbox"],"application/x-virtualbox-vbox-extpack":["vbox-extpack"],"application/x-virtualbox-vdi":["vdi"],"application/x-virtualbox-vhd":["vhd"],"application/x-virtualbox-vmdk":["vmdk"],"application/x-wais-source":["src"],"application/x-web-app-manifest+json":["webapp"],"application/x-x509-ca-cert":["der","crt","pem"],"application/x-xfig":["fig"],"application/x-xliff+xml":["*xlf"],"application/x-xpinstall":["xpi"],"application/x-xz":["xz"],"application/x-zmachine":["z1","z2","z3","z4","z5","z6","z7","z8"],"audio/vnd.dece.audio":["uva","uvva"],"audio/vnd.digital-winds":["eol"],"audio/vnd.dra":["dra"],"audio/vnd.dts":["dts"],"audio/vnd.dts.hd":["dtshd"],"audio/vnd.lucent.voice":["lvp"],"audio/vnd.ms-playready.media.pya":["pya"],"audio/vnd.nuera.ecelp4800":["ecelp4800"],"audio/vnd.nuera.ecelp7470":["ecelp7470"],"audio/vnd.nuera.ecelp9600":["ecelp9600"],"audio/vnd.rip":["rip"],"audio/x-aac":["aac"],"audio/x-aiff":["aif","aiff","aifc"],"audio/x-caf":["caf"],"audio/x-flac":["flac"],"audio/x-m4a":["*m4a"],"audio/x-matroska":["mka"],"audio/x-mpegurl":["m3u"],"audio/x-ms-wax":["wax"],"audio/x-ms-wma":["wma"],"audio/x-pn-realaudio":["ram","ra"],"audio/x-pn-realaudio-plugin":["rmp"],"audio/x-realaudio":["*ra"],"audio/x-wav":["*wav"],"chemical/x-cdx":["cdx"],"chemical/x-cif":["cif"],"chemical/x-cmdf":["cmdf"],"chemical/x-cml":["cml"],"chemical/x-csml":["csml"],"chemical/x-xyz":["xyz"],"image/prs.btif":["btif"],"image/prs.pti":["pti"],"image/vnd.adobe.photoshop":["psd"],"image/vnd.airzip.accelerator.azv":["azv"],"image/vnd.dece.graphic":["uvi","uvvi","uvg","uvvg"],"image/vnd.djvu":["djvu","djv"],"image/vnd.dvb.subtitle":["*sub"],"image/vnd.dwg":["dwg"],"image/vnd.dxf":["dxf"],"image/vnd.fastbidsheet":["fbs"],"image/vnd.fpx":["fpx"],"image/vnd.fst":["fst"],"image/vnd.fujixerox.edmics-mmr":["mmr"],"image/vnd.fujixerox.edmics-rlc":["rlc"],"image/vnd.microsoft.icon":["ico"],"image/vnd.ms-dds":["dds"],"image/vnd.ms-modi":["mdi"],"image/vnd.ms-photo":["wdp"],"image/vnd.net-fpx":["npx"],"image/vnd.pco.b16":["b16"],"image/vnd.tencent.tap":["tap"],"image/vnd.valve.source.texture":["vtf"],"image/vnd.wap.wbmp":["wbmp"],"image/vnd.xiff":["xif"],"image/vnd.zbrush.pcx":["pcx"],"image/x-3ds":["3ds"],"image/x-cmu-raster":["ras"],"image/x-cmx":["cmx"],"image/x-freehand":["fh","fhc","fh4","fh5","fh7"],"image/x-icon":["*ico"],"image/x-jng":["jng"],"image/x-mrsid-image":["sid"],"image/x-ms-bmp":["*bmp"],"image/x-pcx":["*pcx"],"image/x-pict":["pic","pct"],"image/x-portable-anymap":["pnm"],"image/x-portable-bitmap":["pbm"],"image/x-portable-graymap":["pgm"],"image/x-portable-pixmap":["ppm"],"image/x-rgb":["rgb"],"image/x-tga":["tga"],"image/x-xbitmap":["xbm"],"image/x-xpixmap":["xpm"],"image/x-xwindowdump":["xwd"],"message/vnd.wfa.wsc":["wsc"],"model/vnd.collada+xml":["dae"],"model/vnd.dwf":["dwf"],"model/vnd.gdl":["gdl"],"model/vnd.gtw":["gtw"],"model/vnd.mts":["mts"],"model/vnd.opengex":["ogex"],"model/vnd.parasolid.transmit.binary":["x_b"],"model/vnd.parasolid.transmit.text":["x_t"],"model/vnd.usdz+zip":["usdz"],"model/vnd.valve.source.compiled-map":["bsp"],"model/vnd.vtu":["vtu"],"text/prs.lines.tag":["dsc"],"text/vnd.curl":["curl"],"text/vnd.curl.dcurl":["dcurl"],"text/vnd.curl.mcurl":["mcurl"],"text/vnd.curl.scurl":["scurl"],"text/vnd.dvb.subtitle":["sub"],"text/vnd.fly":["fly"],"text/vnd.fmi.flexstor":["flx"],"text/vnd.graphviz":["gv"],"text/vnd.in3d.3dml":["3dml"],"text/vnd.in3d.spot":["spot"],"text/vnd.sun.j2me.app-descriptor":["jad"],"text/vnd.wap.wml":["wml"],"text/vnd.wap.wmlscript":["wmls"],"text/x-asm":["s","asm"],"text/x-c":["c","cc","cxx","cpp","h","hh","dic"],"text/x-component":["htc"],"text/x-fortran":["f","for","f77","f90"],"text/x-handlebars-template":["hbs"],"text/x-java-source":["java"],"text/x-lua":["lua"],"text/x-markdown":["mkd"],"text/x-nfo":["nfo"],"text/x-opml":["opml"],"text/x-org":["*org"],"text/x-pascal":["p","pas"],"text/x-processing":["pde"],"text/x-sass":["sass"],"text/x-scss":["scss"],"text/x-setext":["etx"],"text/x-sfv":["sfv"],"text/x-suse-ymp":["ymp"],"text/x-uuencode":["uu"],"text/x-vcalendar":["vcs"],"text/x-vcard":["vcf"],"video/vnd.dece.hd":["uvh","uvvh"],"video/vnd.dece.mobile":["uvm","uvvm"],"video/vnd.dece.pd":["uvp","uvvp"],"video/vnd.dece.sd":["uvs","uvvs"],"video/vnd.dece.video":["uvv","uvvv"],"video/vnd.dvb.file":["dvb"],"video/vnd.fvt":["fvt"],"video/vnd.mpegurl":["mxu","m4u"],"video/vnd.ms-playready.media.pyv":["pyv"],"video/vnd.uvvu.mp4":["uvu","uvvu"],"video/vnd.vivo":["viv"],"video/x-f4v":["f4v"],"video/x-fli":["fli"],"video/x-flv":["flv"],"video/x-m4v":["m4v"],"video/x-matroska":["mkv","mk3d","mks"],"video/x-mng":["mng"],"video/x-ms-asf":["asf","asx"],"video/x-ms-vob":["vob"],"video/x-ms-wm":["wm"],"video/x-ms-wmv":["wmv"],"video/x-ms-wmx":["wmx"],"video/x-ms-wvx":["wvx"],"video/x-msvideo":["avi"],"video/x-sgi-movie":["movie"],"video/x-smv":["smv"],"x-conference/x-cooltalk":["ice"]};

var mime = new Mime_1(standard, other);

// eslint-disable-next-line import/no-extraneous-dependencies
function getFileMimeType(filePath) {
  const extension = getFileExt(filePath);
  const mimeType = mime.getType(extension);
  return mimeType;
}

const UNIX_SEP = '/';
const WIN_SEP = '\\';
function getFileName(filePath) {
  if (!filePath) {
    return '';
  }

  let indexSep = filePath.lastIndexOf(UNIX_SEP);

  if (indexSep === -1) {
    indexSep = filePath.lastIndexOf(WIN_SEP);
  }

  if (indexSep === -1) {
    return filePath;
  }

  return filePath.slice(indexSep + 1);
}

function resolveFile(fixture, window) {
  const {
    filePath,
    encoding,
    mimeType,
    fileName,
    lastModified
  } = fixture;
  const fileMimeType = mimeType || getFileMimeType(filePath);
  const fileEncoding = encoding || getFileEncoding(filePath);
  const fileLastModified = lastModified || Date.now();
  return new Cypress.Promise(resolve => getFileContent({
    filePath,
    fileContent: fixture.fileContent,
    fileEncoding
  }).then(fileContent => getFileBlobAsync({
    fileContent,
    fileName,
    mimeType: fileMimeType,
    encoding: fileEncoding,
    lastModified: fileLastModified,
    window
  })).then(resolve));
}

function getFixtureInfo(fixtureInput) {
  if (typeof fixtureInput === 'string') {
    return {
      filePath: fixtureInput,
      encoding: '',
      mimeType: '',
      fileName: getFileName(fixtureInput)
    };
  }

  return {
    filePath: fixtureInput.filePath,
    encoding: fixtureInput.encoding || '',
    mimeType: fixtureInput.mimeType || '',
    fileName: fixtureInput.fileName || getFileName(fixtureInput.filePath),
    fileContent: fixtureInput.fileContent,
    lastModified: fixtureInput.lastModified
  };
}

function getForceValue(subject) {
  return isManualEventHandling() || !isElementVisible(subject) || isShadowElement(subject);
}

const ERR_TYPES = {
  INVALID_SUBJECT_TYPE: {
    message: '"subjectType" is not valid',
    tip: 'Please look into docs to find supported "subjectType" values'
  },
  INVALID_FORCE: {
    message: '"force" is not valid',
    tip: 'Please look into docs to find supported "force" values'
  },
  INVALID_ALLOW_EMPTY: {
    message: '"allowEmpty" is not valid',
    tip: 'Please look into docs to find supported "allowEmpty" values'
  },
  INVALID_FILE_ENCODING: {
    message: '"file encoding" is not valid',
    tip: 'Please look into docs to find supported "encoding" values'
  },
  INVALID_FILE_PATH: {
    message: '"filePath" is not valid',
    tip: 'Please look into docs to find supported "filePath" values'
  },
  INVALID_MIME_TYPE: {
    message: '"mimeType" is not valid',
    tip: 'Please look into docs to find supported "mimeType" values'
  },
  INVALID_FILE: {
    message: 'given fixture file is empty',
    tip: 'Please make sure you provide correct file or explicitly set "allowEmpty" to true'
  },
  INVALID_LAST_MODIFIED: {
    message: '"lastModified" is not valid"',
    tip: 'Please make sure you are passing a "number" `Date.now()` or `new Date().getTime()'
  },
  MISSING_FILE_NAME_OR_PATH: {
    message: 'missing "filePath" or "fileName"',
    tip: 'Please make sure you are passing either "filePath" or "fileName"'
  }
};
class InternalError extends Error {
  constructor(errorType, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InternalError);
    }

    this.name = '[cypress-file-upload error]';
    this.message = `${errorType.message}.\n${errorType.tip}`;
  }

}

const ALLOWED_ENCODINGS = Object.values(ENCODING);
function validateFixtures(fixture) {
  const {
    filePath,
    fileName,
    encoding,
    mimeType,
    fileContent,
    lastModified
  } = fixture;

  if (encoding && !ALLOWED_ENCODINGS.includes(encoding)) {
    throw new InternalError(ERR_TYPES.INVALID_FILE_ENCODING);
  }

  if (typeof filePath !== 'string' && !fileContent) {
    throw new InternalError(ERR_TYPES.INVALID_FILE_PATH);
  }

  if (typeof mimeType !== 'string') {
    throw new InternalError(ERR_TYPES.INVALID_MIME_TYPE);
  }

  if (!filePath && !fileName) {
    throw new InternalError(ERR_TYPES.MISSING_FILE_NAME_OR_PATH);
  }

  if (lastModified && typeof lastModified !== 'number') {
    throw new InternalError(ERR_TYPES.INVALID_LAST_MODIFIED);
  }

  return true;
}

var validateFile = ((file, allowEmpty) => {
  if (!allowEmpty) {
    const {
      size
    } = file;

    if (size === 0) {
      throw new InternalError(ERR_TYPES.INVALID_FILE);
    }
  }

  return true;
});

var validateOptions = (({
  subjectType,
  force,
  allowEmpty
}) => {
  if (Object.values(SUBJECT_TYPE).indexOf(subjectType) === -1) {
    throw new InternalError(ERR_TYPES.INVALID_SUBJECT_TYPE);
  }

  if (typeof force !== 'boolean') {
    throw new InternalError(ERR_TYPES.INVALID_FORCE);
  }

  if (typeof allowEmpty !== 'boolean') {
    throw new InternalError(ERR_TYPES.INVALID_ALLOW_EMPTY);
  }

  return true;
});

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function merge(target = {}, source = {}) {
  return _extends({}, source, target);
}

function attachFile(subject, fixtureOrFixtureArray, processingOptions) {
  const {
    subjectType,
    force,
    allowEmpty
  } = merge(processingOptions, DEFAULT_PROCESSING_OPTIONS);
  validateOptions({
    subjectType,
    force,
    allowEmpty
  });
  const fixturesArray = Array.isArray(fixtureOrFixtureArray) ? fixtureOrFixtureArray : [fixtureOrFixtureArray];
  const fixtures = fixturesArray.map(getFixtureInfo).filter(validateFixtures);
  Cypress.cy.window({
    log: false
  }).then(window => {
    const forceValue = force || getForceValue(subject);
    Cypress.Promise.all(fixtures.map(f => resolveFile(f, window))) // resolve files
    .then(files => files.filter(f => validateFile(f, allowEmpty))) // error if any of the file contents are invalid
    .then(files => {
      attachFileToElement(subject, {
        files,
        subjectType,
        force: forceValue,
        window
      });
      return files;
    }).then(files => Cypress.log({
      name: 'attachFile',
      displayName: 'FILE',
      message: files.reduce((acc, f) => `${acc.length > 0 ? `${acc}, ` : acc}${f.name}`, '')
    }));
  });
  return Cypress.cy.wrap(subject, {
    log: false
  });
}

const initialize = () => {
  Cypress.Commands.add('attachFile', {
    prevSubject: true
  }, attachFile);
};

initialize();
//# sourceMappingURL=bundle.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************************************!*\
  !*** ./cypress/e2e/registration_form_3_test.cy.js ***!
  \****************************************************/


__webpack_require__(/*! cypress-file-upload */ "./node_modules/cypress-file-upload/dist/bundle.js");
beforeEach(() => {
  cy.visit("cypress/fixtures/registration_form_3.html");
});

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */

describe("Bonus section: Visual tests, created by: Kadi-Kristel", () => {
  it("Check that Country dropdown is correct and City dropdown updates accordingly", () => {
    cy.get("#country").children().should("have.length", 4);
    cy.get("#country").find("option").should("have.length", 4);

    // Select a country (Estonia)
    cy.get("#country").select("Estonia").should("have.value", "object:4");
    cy.get("#city").select("Haapsalu");
    cy.get("#city").should("contain", "Haapsalu");

    // Change a country to Spain
    cy.get("#country").select("Spain").should("have.value", "object:3");

    // Verify that city "Haapsalu" is removed
    cy.get("#city").find("option").should("not.contain", "Haapsalu");
    const expectedCityOptions = ["", "Malaga", "Madrid", "Valencia", "Corralejo"];
    cy.get("#city").find("option").then($options => {
      const actualCityOptions = [...$options].map(option => option.text);
      expect(actualCityOptions).to.deep.eq(expectedCityOptions);
    });
    cy.get("#city").select("Valencia");
    cy.get("#city").should("contain", "Valencia");
  });
  it("Check that radio button list is correct", () => {
    cy.get('input[type="radio"]').should("have.length", 4);
    cy.get("input[type=radio]").next().eq(0).should("have.text", "Daily");
    cy.get("input[type=radio]").next().eq(1).should("have.text", "Weekly");
    cy.get("input[type=radio]").next().eq(2).should("have.text", "Monthly");
    cy.get("input[type=radio]").next().eq(3).should("have.text", "Never");
    cy.get('input[type="radio"]').eq(0).should("not.be.checked");
    cy.get('input[type="radio"]').eq(1).should("not.be.checked");
    cy.get('input[type="radio"]').eq(2).should("not.be.checked");
    cy.get('input[type="radio"]').eq(3).should("not.be.checked");
    cy.get('input[type="radio"]').eq(1).check().should("be.checked");
    cy.get('input[type="radio"]').eq(3).check().should("be.checked");
    cy.get('input[type="radio"]').eq(1).should("not.be.checked");
  });
  it("Check that checkbox list is correct", () => {
    cy.get('input[type="checkbox"]').should("have.length", 2);
    cy.get('input[type="checkbox"]').next().eq(0).should("have.text", "");
    cy.get('input[type="checkbox"]').next().eq(1).should("have.text", "Accept our cookie policy");
    cy.get('input[type="checkbox"]').eq(0).should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(1).should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(0).check().should("be.checked");
    cy.get('input[type="checkbox"]').eq(1).check().should("be.checked");
    cy.get('button a[href="cookiePolicy.html"]').click();
    cy.url().should("include", "cookiePolicy.html");
    cy.go("back");
    cy.url().should("not.include", "cookiePolicy.html");
    cy.get('input[type="checkbox"]').eq(0).should("be.checked");
    cy.get('input[type="checkbox"]').eq(1).should("be.checked");
  });
  it("Check that email format is correct", () => {
    cy.get('input[name="email"]').type("kadi.test.com");
    cy.get('#emailAlert span[ng-show="myForm.email.$error.email"]').should("be.visible").and("contain", "Invalid email address");
    cy.get('input[name="email"]').clear();
    cy.get('input[name="email"]').type("kadi@test.com");
    cy.get('#emailAlert span[ng-show="myForm.email.$error.email"]').should("not.be.visible");
  });
  it("Check that datepicker works for date of registration", () => {
    const today = new Date();
    const date = today.toISOString().split("T")[0];
    cy.get('input[type="date"]').first().type(date);
    cy.get('input[type="date"]').should("have.value", date);
  });
});
/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */

describe("Bonus section: Functional tests, created by: Kadi-Kristel", () => {
  it("User can submit form with all fields valid", () => {
    cy.get("#name").type("Kadi");
    cy.get('input[name="email"]').type("kadi@test.com");
    cy.get('#emailAlert span[ng-show="myForm.email.$error.email"]').should("not.be.visible");
    cy.get("#emailAlert").should("not.be.visible");
    cy.get("#country").select("object:5").should("contain", "Austria");

    // After submitting the form, city dropdown seems to be broken. It doesn't display Salzburg anymore (all the other fields are still filled)
    cy.get("#city").select("Salzburg").should("contain", "Salzburg");
    cy.get('input[type="date"]').first().type("2024-07-12");
    cy.get('input[type="radio"]').check("Monthly");
    cy.get("#birthday").type("1995-03-29");
    cy.get('input[type="checkbox"]').eq(1).check();
    cy.get('input[type="checkbox"]').eq(1).should("be.checked");
    cy.get("#checkboxAlert").should("not.be.visible");

    // Uploading a file
    const fileName = "example_file_form3";
    cy.get("#myFile").attachFile(fileName);
    cy.get('button[type="submit"]').click();
    cy.go("back");
    cy.log("Back again in Registration form 3");
  });
  it("User fills only mandatory fields", () => {
    cy.get("#name").type("Kadi");
    cy.get('input[name="email"]').type("kadi@test.com");
    cy.get('#emailAlert span[ng-show="myForm.email.$error.email"]').should("not.be.visible");
    cy.get("#emailAlert").should("not.be.visible");
    cy.get("#country").select("object:4").should("contain", "Estonia");
    cy.get("#city").select("Tartu").should("contain", "Tartu");
    cy.get("#birthday").type("1995-03-29");
    cy.get('input[type="checkbox"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(0).should("be.checked");
    cy.get("#checkboxAlert").should("not.be.visible");
    cy.get('input[type="submit"]').click();
    cy.go("back");
    cy.log("Back again in Registration form 3");
  });
  it.only("Mandatory fields are absent with corresponding assertions", () => {
    inputEmptyMandatoryFields();
  });
});
function inputEmptyMandatoryFields() {
  cy.log("Leaving mandatory fields empty");
  cy.get('input[name="email"]').clear().type("a").clear().blur();
  cy.get("#name").clear().type("a").clear().blur();

  // Check if the email alert element is visible
  cy.get("div#emailAlert").should("be.visible");

  // Ensure the specific required email message is visible
  cy.get("div#emailAlert span[ng-show='myForm.email.$error.required']").should("be.visible").and("contain", "Email is required");
  cy.get('input[ng-model="checkbox"]').uncheck();
  cy.contains("#checkboxAlert", "Checkbox is required").should("not.be.visible");
  cy.get('input[type="checkbox"]').eq(1).should("not.be.checked");
  cy.get('input[type="submit"]').should("be.disabled");
  cy.get('input[type="date"]').first().type("2024-07-12");
  const fileName = "example_file_form3";
  cy.get("#myFile").attachFile(fileName);
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uX2Zvcm1fM190ZXN0LmN5LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QixXQUFXLFFBQVE7QUFDbkIsV0FBVyxjQUFjO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxXQUFXO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGlCQUFpQjtBQUM1QixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsaUJBQWlCO0FBQzVCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7OztBQUdKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsbUNBQW1DO0FBQ3hEO0FBQ0E7QUFDQTtBQUNB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QyxDQUFDLENBQUNSLElBQUksQ0FBQyxZQUFZLENBQUM7RUFFdkQsTUFBTVMsUUFBUSxHQUFHLG9CQUFvQjtFQUNyQ2xDLEVBQUUsQ0FBQ0ksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDK0IsVUFBVSxDQUFDRCxRQUFRLENBQUM7QUFDeEMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2N5cHJlc3N0dXRvcmlhbC8uL25vZGVfbW9kdWxlcy9jeXByZXNzLWZpbGUtdXBsb2FkL2Rpc3QvYnVuZGxlLmpzIiwid2VicGFjazovL2N5cHJlc3N0dXRvcmlhbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jeXByZXNzdHV0b3JpYWwvLi9jeXByZXNzL2UyZS9yZWdpc3RyYXRpb25fZm9ybV8zX3Rlc3QuY3kuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBERUZBVUxUX1BST0NFU1NJTkdfT1BUSU9OUyA9IE9iamVjdC5mcmVlemUoe1xuICBzdWJqZWN0VHlwZTogJ2lucHV0JyxcbiAgZm9yY2U6IGZhbHNlLFxuICBhbGxvd0VtcHR5OiBmYWxzZVxufSk7XG5jb25zdCBTVUJKRUNUX1RZUEUgPSBPYmplY3QuZnJlZXplKHtcbiAgSU5QVVQ6ICdpbnB1dCcsXG4gIERSQUdfTl9EUk9QOiAnZHJhZy1uLWRyb3AnXG59KTtcbmNvbnN0IEVWRU5UU19CWV9TVUJKRUNUX1RZUEUgPSB7XG4gIFtTVUJKRUNUX1RZUEUuSU5QVVRdOiBbJ2NoYW5nZSddLFxuXG4gIC8qKlxuICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9EcmFnRXZlbnRcbiAgICovXG4gIFtTVUJKRUNUX1RZUEUuRFJBR19OX0RST1BdOiBbJ2RyYWdzdGFydCcsICdkcmFnJywgJ2RyYWdlbnRlcicsICdkcm9wJywgJ2RyYWdsZWF2ZScsICdkcmFnZW5kJ11cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIGRpc3BhdGNoZXMgY3VzdG9tIGV2ZW50IHdpdGggZGF0YVRyYW5zZmVyIG9iamVjdCBwcm92aWRlZFxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0RhdGFUcmFuc2Zlcn0gZGF0YVRyYW5zZmVyXG4gKi9cbmZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQodGFyZ2V0LCBldmVudCwgZGF0YVRyYW5zZmVyKSB7XG4gIGNvbnN0IGV2ZW50UGF5bG9hZCA9IHtcbiAgICBidWJibGVzOiB0cnVlLFxuICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgZGV0YWlsOiBkYXRhVHJhbnNmZXJcbiAgfTtcblxuICB0cnkge1xuICAgIGNvbnN0IGUgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnQsIGV2ZW50UGF5bG9hZCk7XG4gICAgT2JqZWN0LmFzc2lnbihlLCB7XG4gICAgICBkYXRhVHJhbnNmZXJcbiAgICB9KTtcbiAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChlKTtcbiAgfSBjYXRjaCAoZSkgey8vIG1ha2Ugc3VyZSBldmVudCB0cmlnZ2VyaW5nIHdvbid0IGJyZWFrIGlmIHN1YmplY3QgZWxlbWVudCBpcyBub3QgdmlzaWJsZSBvciBpbiBET00gYW55bW9yZVxuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIGRldGVybWluZXMgaWYgZWxlbWVudCBpcyB2aXNpYmxlIGluIERPTVxuICpcbiAqIEBwYXJhbSB7Q3lwcmVzcy5TdWJqZWN0fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNFbGVtZW50VmlzaWJsZShlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBjYW5ub3QgYmUgZW1wdHknKTtcbiAgfVxuICAvKiBydW5uaW5nIGlzVmlzaWJsZSBjb21tYW5kIG9uIGRldGFjaGVkIGVsZW1lbnQgdGhyb3dzIGFuIGVycm9yICovXG5cblxuICByZXR1cm4gQ3lwcmVzcy5kb20uaXNBdHRhY2hlZChlbGVtZW50KSAmJiBDeXByZXNzLmRvbS5pc1Zpc2libGUoZWxlbWVudCk7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIGRldGVybWluZXMgaWYgZWxlbWVudCBpcyB2aXNpYmxlIGluIERPTVxuICpcbiAqIEBwYXJhbSB7Q3lwcmVzcy5TdWJqZWN0fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNTaGFkb3dFbGVtZW50KGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGNhbm5vdCBiZSBlbXB0eScpO1xuICB9XG5cbiAgcmV0dXJuIEN5cHJlc3MuZG9tLmlzRGV0YWNoZWQoZWxlbWVudCk7XG59XG5cbmNvbnN0IEJST1dTRVJfQ0hST01FID0gJ2Nocm9tZSc7XG5mdW5jdGlvbiBpc01hbnVhbEV2ZW50SGFuZGxpbmcoKSB7XG4gIGNvbnN0IHtcbiAgICBuYW1lLFxuICAgIG1ham9yVmVyc2lvblxuICB9ID0gQ3lwcmVzcy5icm93c2VyO1xuXG4gIGlmIChuYW1lID09PSBCUk9XU0VSX0NIUk9NRSAmJiBtYWpvclZlcnNpb24gPCA3Mykge1xuICAgIC8qKlxuICAgICAqIENocm9tZSA8NzMgdHJpZ2dlcnMgJ2NoYW5nZScgZXZlbnQgYXV0b21hdGljYWxseVxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hYnJhbWVuYWwvY3lwcmVzcy1maWxlLXVwbG9hZC9pc3N1ZXMvMzRcbiAgICAgKi9cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuY29uc3QgQlJPV1NFUl9GSVJFRk9YID0gJ2ZpcmVmb3gnO1xuZnVuY3Rpb24gaXNCcm93c2VyRmlyZWZveCgpIHtcbiAgY29uc3Qge1xuICAgIG5hbWVcbiAgfSA9IEN5cHJlc3MuYnJvd3NlcjtcbiAgcmV0dXJuIG5hbWUgPT09IEJST1dTRVJfRklSRUZPWDtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hFdmVudHMoZWxlbWVudCwgZXZlbnRzLCBkYXRhVHJhbnNmZXIpIHtcbiAgZXZlbnRzLmZvckVhY2goZXZlbnQgPT4ge1xuICAgIGRpc3BhdGNoRXZlbnQoZWxlbWVudCwgZXZlbnQsIGRhdGFUcmFuc2Zlcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRFdmVudHNCeVN1YmplY3RUeXBlKHN1YmplY3RUeXBlKSB7XG4gIGNvbnN0IGV2ZW50cyA9IEVWRU5UU19CWV9TVUJKRUNUX1RZUEVbc3ViamVjdFR5cGVdO1xuICAvKipcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYWJyYW1lbmFsL2N5cHJlc3MtZmlsZS11cGxvYWQvaXNzdWVzLzI5M1xuICAgKi9cblxuICBpZiAoc3ViamVjdFR5cGUgPT09IFNVQkpFQ1RfVFlQRS5EUkFHX05fRFJPUCAmJiBpc0Jyb3dzZXJGaXJlZm94KCkpIHtcbiAgICBldmVudHMucHVzaCgnY2hhbmdlJyk7XG4gIH1cblxuICByZXR1cm4gZXZlbnRzO1xufVxuXG5mdW5jdGlvbiBhdHRhY2hGaWxlVG9FbGVtZW50KHN1YmplY3QsIHtcbiAgZmlsZXMsXG4gIHN1YmplY3RUeXBlLFxuICBmb3JjZSxcbiAgd2luZG93XG59KSB7XG4gIGNvbnN0IGRhdGFUcmFuc2ZlciA9IG5ldyB3aW5kb3cuRGF0YVRyYW5zZmVyKCk7XG4gIGZpbGVzLmZvckVhY2goZiA9PiBkYXRhVHJhbnNmZXIuaXRlbXMuYWRkKGYpKTtcblxuICBpZiAoc3ViamVjdFR5cGUgPT09IFNVQkpFQ1RfVFlQRS5JTlBVVCkge1xuICAgIGNvbnN0IGlucHV0RWxlbWVudCA9IHN1YmplY3RbMF07XG4gICAgaW5wdXRFbGVtZW50LmZpbGVzID0gZGF0YVRyYW5zZmVyLmZpbGVzO1xuXG4gICAgaWYgKGZvcmNlKSB7XG4gICAgICBkaXNwYXRjaEV2ZW50cyhpbnB1dEVsZW1lbnQsIGdldEV2ZW50c0J5U3ViamVjdFR5cGUoc3ViamVjdFR5cGUpLCBkYXRhVHJhbnNmZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChzdWJqZWN0VHlwZSA9PT0gU1VCSkVDVF9UWVBFLkRSQUdfTl9EUk9QKSB7XG4gICAgY29uc3QgaW5wdXRFbGVtZW50cyA9IHN1YmplY3RbMF0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cImZpbGVcIl0nKTtcbiAgICAvKipcbiAgICAgKiBUcnkgdG8gZmluZCB1bmRlcmx5aW5nIGZpbGUgaW5wdXQgZWxlbWVudCwgYXMgbGlrZWx5IGRyYWctbi1kcm9wIGNvbXBvbmVudCB1c2VzIGl0IGludGVybmFsbHlcbiAgICAgKiBPdGhlcndpc2UgZGlzcGF0Y2ggYWxsIGV2ZW50cyBvbiBzdWJqZWN0IGVsZW1lbnRcbiAgICAgKi9cblxuICAgIGlmIChpbnB1dEVsZW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgaW5wdXRFbGVtZW50ID0gaW5wdXRFbGVtZW50c1swXTtcbiAgICAgIGlucHV0RWxlbWVudC5maWxlcyA9IGRhdGFUcmFuc2Zlci5maWxlcztcblxuICAgICAgaWYgKGZvcmNlKSB7XG4gICAgICAgIGRpc3BhdGNoRXZlbnRzKGlucHV0RWxlbWVudCwgZ2V0RXZlbnRzQnlTdWJqZWN0VHlwZShzdWJqZWN0VHlwZSksIGRhdGFUcmFuc2Zlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGlucHV0RWxlbWVudCA9IHN1YmplY3RbMF07XG4gICAgICBpbnB1dEVsZW1lbnQuZmlsZXMgPSBkYXRhVHJhbnNmZXIuZmlsZXM7XG5cbiAgICAgIGlmIChmb3JjZSkge1xuICAgICAgICBkaXNwYXRjaEV2ZW50cyhpbnB1dEVsZW1lbnQsIGdldEV2ZW50c0J5U3ViamVjdFR5cGUoc3ViamVjdFR5cGUpLCBkYXRhVHJhbnNmZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBFTkNPRElORyA9IE9iamVjdC5mcmVlemUoe1xuICBBU0NJSTogJ2FzY2lpJyxcbiAgQkFTRTY0OiAnYmFzZTY0JyxcbiAgQklOQVJZOiAnYmluYXJ5JyxcbiAgSEVYOiAnaGV4JyxcbiAgTEFUSU4xOiAnbGF0aW4xJyxcbiAgVVRGODogJ3V0ZjgnLFxuICBVVEZfODogJ3V0Zi04JyxcbiAgVUNTMjogJ3VjczInLFxuICBVQ1NfMjogJ3Vjcy0yJyxcbiAgVVRGMTZMRTogJ3V0ZjE2bGUnLFxuICBVVEZfMTZMRTogJ3V0Zi0xNmxlJ1xufSk7XG5jb25zdCBGSUxFX0VYVEVOU0lPTiA9IE9iamVjdC5mcmVlemUoe1xuICBKU09OOiAnanNvbicsXG4gIEpTOiAnanMnLFxuICBDT0ZGRUU6ICdjb2ZmZWUnLFxuICBIVE1MOiAnaHRtbCcsXG4gIFRYVDogJ3R4dCcsXG4gIENTVjogJ2NzdicsXG4gIFBORzogJ3BuZycsXG4gIEpQRzogJ2pwZycsXG4gIEpQRUc6ICdqcGVnJyxcbiAgR0lGOiAnZ2lmJyxcbiAgVElGOiAndGlmJyxcbiAgVElGRjogJ3RpZmYnLFxuICBaSVA6ICd6aXAnLFxuICBQREY6ICdwZGYnLFxuICBWQ0Y6ICd2Y2YnLFxuICBTVkc6ICdzdmcnLFxuICBYTFM6ICd4bHMnLFxuICBYTFNYOiAneGxzeCcsXG4gIERPQzogJ2RvYycsXG4gIERPQ1g6ICdkb2N4JyxcbiAgTVAzOiAnbXAzJ1xufSk7XG5cbmNvbnN0IHdyYXBCbG9iID0gYmxvYiA9PiB7XG4gIC8vIEN5cHJlc3MgdmVyc2lvbiA1IGFzc2lnbnMgYSBmdW5jdGlvbiB3aXRoIGEgY29tcGF0aWJpbGl0eSB3YXJuaW5nXG4gIC8vIHRvIGJsb2IudGhlbiwgYnV0IHRoYXQgbWFrZXMgdGhlIEJsb2IgYWN0dWFsbHkgdGhlbmFibGUuIFdlIGhhdmVcbiAgLy8gdG8gcmVtb3ZlIHRoYXQgdG8gUHJvbWlzZS5yZXNvbHZlIG5vdCB0cmVhdCBpdCBhcyB0aGVuYWJsZS5cbiAgaWYgKGJsb2IgaW5zdGFuY2VvZiBDeXByZXNzLlByb21pc2UpIHtcbiAgICByZXR1cm4gYmxvYjtcbiAgfSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cblxuXG4gIGRlbGV0ZSBibG9iLnRoZW47XG4gIHJldHVybiBDeXByZXNzLlByb21pc2UucmVzb2x2ZShibG9iKTtcbn07XG5cbmZ1bmN0aW9uIGdldEZpbGVFeHQoZmlsZVBhdGgpIHtcbiAgaWYgKCFmaWxlUGF0aCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGNvbnN0IHBvcyA9IGZpbGVQYXRoLmxhc3RJbmRleE9mKCcuJyk7XG5cbiAgaWYgKHBvcyA9PT0gLTEpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXR1cm4gZmlsZVBhdGguc2xpY2UocG9zICsgMSk7XG59XG5cbmNvbnN0IEVOQ09ESU5HX1RPX0JMT0JfR0VUVEVSID0ge1xuICBbRU5DT0RJTkcuQVNDSUldOiBmaWxlQ29udGVudCA9PiBDeXByZXNzLlByb21pc2UucmVzb2x2ZShmaWxlQ29udGVudCksXG4gIFtFTkNPRElORy5CQVNFNjRdOiAoZmlsZUNvbnRlbnQsIG1pbWVUeXBlKSA9PiB3cmFwQmxvYihDeXByZXNzLkJsb2IuYmFzZTY0U3RyaW5nVG9CbG9iKGZpbGVDb250ZW50LCBtaW1lVHlwZSkpLFxuICBbRU5DT0RJTkcuQklOQVJZXTogKGZpbGVDb250ZW50LCBtaW1lVHlwZSkgPT4gd3JhcEJsb2IoQ3lwcmVzcy5CbG9iLmJpbmFyeVN0cmluZ1RvQmxvYihmaWxlQ29udGVudCwgbWltZVR5cGUpKSxcbiAgW0VOQ09ESU5HLkhFWF06IGZpbGVDb250ZW50ID0+IEN5cHJlc3MuUHJvbWlzZS5yZXNvbHZlKGZpbGVDb250ZW50KSxcbiAgW0VOQ09ESU5HLkxBVElOMV06IGZpbGVDb250ZW50ID0+IEN5cHJlc3MuUHJvbWlzZS5yZXNvbHZlKGZpbGVDb250ZW50KSxcbiAgW0VOQ09ESU5HLlVURjhdOiBmaWxlQ29udGVudCA9PiBDeXByZXNzLlByb21pc2UucmVzb2x2ZShmaWxlQ29udGVudCksXG4gIFtFTkNPRElORy5VVEZfOF06IGZpbGVDb250ZW50ID0+IEN5cHJlc3MuUHJvbWlzZS5yZXNvbHZlKGZpbGVDb250ZW50KSxcbiAgW0VOQ09ESU5HLlVDUzJdOiBmaWxlQ29udGVudCA9PiBDeXByZXNzLlByb21pc2UucmVzb2x2ZShmaWxlQ29udGVudCksXG4gIFtFTkNPRElORy5VQ1NfMl06IGZpbGVDb250ZW50ID0+IEN5cHJlc3MuUHJvbWlzZS5yZXNvbHZlKGZpbGVDb250ZW50KSxcbiAgW0VOQ09ESU5HLlVURjE2TEVdOiBmaWxlQ29udGVudCA9PiBDeXByZXNzLlByb21pc2UucmVzb2x2ZShmaWxlQ29udGVudCksXG4gIFtFTkNPRElORy5VVEZfMTZMRV06IGZpbGVDb250ZW50ID0+IEN5cHJlc3MuUHJvbWlzZS5yZXNvbHZlKGZpbGVDb250ZW50KVxufTtcbmZ1bmN0aW9uIGdldEZpbGVCbG9iQXN5bmMoe1xuICBmaWxlTmFtZSxcbiAgZmlsZUNvbnRlbnQsXG4gIG1pbWVUeXBlLFxuICBlbmNvZGluZyxcbiAgd2luZG93LFxuICBsYXN0TW9kaWZpZWRcbn0pIHtcbiAgY29uc3QgZ2V0QmxvYiA9IEVOQ09ESU5HX1RPX0JMT0JfR0VUVEVSW2VuY29kaW5nXTtcbiAgcmV0dXJuIGdldEJsb2IoZmlsZUNvbnRlbnQsIG1pbWVUeXBlKS50aGVuKGJsb2IgPT4ge1xuICAgIGxldCBibG9iQ29udGVudCA9IGJsb2I7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hYnJhbWVuYWwvY3lwcmVzcy1maWxlLXVwbG9hZC9pc3N1ZXMvMTc1XG5cbiAgICBpZiAoZ2V0RmlsZUV4dChmaWxlTmFtZSkgPT09IEZJTEVfRVhURU5TSU9OLkpTT04pIHtcbiAgICAgIGJsb2JDb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoZmlsZUNvbnRlbnQsIG51bGwsIDIpO1xuICAgIH0gLy8gd2UgbXVzdCB1c2UgdGhlIGZpbGUgY29uc3RydWN0b3IgZnJvbSB0aGUgc3ViamVjdCB3aW5kb3cgc28gdGhpcyBjaGVjayBgZmlsZSBpbnN0YW5jZW9mIEZpbGVgLCBjYW4gcGFzc1xuXG5cbiAgICBjb25zdCBmaWxlID0gbmV3IHdpbmRvdy5GaWxlKFtibG9iQ29udGVudF0sIGZpbGVOYW1lLCB7XG4gICAgICB0eXBlOiBtaW1lVHlwZSxcbiAgICAgIGxhc3RNb2RpZmllZFxuICAgIH0pO1xuICAgIHJldHVybiBmaWxlO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0RmlsZUNvbnRlbnQoe1xuICBmaWxlUGF0aCxcbiAgZmlsZUNvbnRlbnQsXG4gIGZpbGVFbmNvZGluZ1xufSkge1xuICAvLyBhbGxvd3MgdXNlcnMgdG8gcHJvdmlkZSBmaWxlIGNvbnRlbnQuXG4gIGlmIChmaWxlQ29udGVudCkge1xuICAgIHJldHVybiB3cmFwQmxvYihmaWxlQ29udGVudCk7XG4gIH1cblxuICByZXR1cm4gQ3lwcmVzcy5jeS5maXh0dXJlKGZpbGVQYXRoLCBmaWxlRW5jb2RpbmcpO1xufVxuXG4vKlxuICogQ29waWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2N5cHJlc3MtaW8vY3lwcmVzcy9ibG9iL2RldmVsb3AvcGFja2FnZXMvc2VydmVyL2xpYi9maXh0dXJlLmNvZmZlZSNMMTA0XG4gKi9cblxuY29uc3QgRVhURU5TSU9OX1RPX0VOQ09ESU5HID0ge1xuICBbRklMRV9FWFRFTlNJT04uSlNPTl06IEVOQ09ESU5HLlVURjgsXG4gIFtGSUxFX0VYVEVOU0lPTi5KU106IEVOQ09ESU5HLlVURjgsXG4gIFtGSUxFX0VYVEVOU0lPTi5DT0ZGRUVdOiBFTkNPRElORy5VVEY4LFxuICBbRklMRV9FWFRFTlNJT04uSFRNTF06IEVOQ09ESU5HLlVURjgsXG4gIFtGSUxFX0VYVEVOU0lPTi5UWFRdOiBFTkNPRElORy5VVEY4LFxuICBbRklMRV9FWFRFTlNJT04uQ1NWXTogRU5DT0RJTkcuVVRGOCxcbiAgW0ZJTEVfRVhURU5TSU9OLlBOR106IEVOQ09ESU5HLkJBU0U2NCxcbiAgW0ZJTEVfRVhURU5TSU9OLkpQR106IEVOQ09ESU5HLkJBU0U2NCxcbiAgW0ZJTEVfRVhURU5TSU9OLkpQRUddOiBFTkNPRElORy5CQVNFNjQsXG4gIFtGSUxFX0VYVEVOU0lPTi5HSUZdOiBFTkNPRElORy5CQVNFNjQsXG4gIFtGSUxFX0VYVEVOU0lPTi5USUZdOiBFTkNPRElORy5CQVNFNjQsXG4gIFtGSUxFX0VYVEVOU0lPTi5USUZGXTogRU5DT0RJTkcuQkFTRTY0LFxuICBbRklMRV9FWFRFTlNJT04uWklQXTogRU5DT0RJTkcuQkFTRTY0LFxuXG4gIC8qXG4gICAqIE90aGVyIGV4dGVuc2lvbnMgdGhhdCBhcmUgbm90IHN1cHBvcnRlZCBieSBjeS5maXh0dXJlIGJ5IGRlZmF1bHQ6XG4gICAqL1xuICBbRklMRV9FWFRFTlNJT04uUERGXTogRU5DT0RJTkcuVVRGOCxcbiAgW0ZJTEVfRVhURU5TSU9OLlZDRl06IEVOQ09ESU5HLlVURjgsXG4gIFtGSUxFX0VYVEVOU0lPTi5TVkddOiBFTkNPRElORy5VVEY4LFxuICBbRklMRV9FWFRFTlNJT04uWExTXTogRU5DT0RJTkcuQklOQVJZLFxuICBbRklMRV9FWFRFTlNJT04uWExTWF06IEVOQ09ESU5HLkJJTkFSWSxcbiAgW0ZJTEVfRVhURU5TSU9OLkRPQ106IEVOQ09ESU5HLkJJTkFSWSxcbiAgW0ZJTEVfRVhURU5TSU9OLkRPQ1hdOiBFTkNPRElORy5CSU5BUlksXG4gIFtGSUxFX0VYVEVOU0lPTi5NUDNdOiBFTkNPRElORy5CSU5BUllcbn07XG5jb25zdCBERUZBVUxUX0VOQ09ESU5HID0gRU5DT0RJTkcuVVRGODtcbmZ1bmN0aW9uIGdldEZpbGVFbmNvZGluZyhmaWxlUGF0aCkge1xuICBjb25zdCBleHRlbnNpb24gPSBnZXRGaWxlRXh0KGZpbGVQYXRoKTtcbiAgY29uc3QgZW5jb2RpbmcgPSBFWFRFTlNJT05fVE9fRU5DT0RJTkdbZXh0ZW5zaW9uXTtcbiAgcmV0dXJuIGVuY29kaW5nIHx8IERFRkFVTFRfRU5DT0RJTkc7XG59XG5cbi8qKlxuICogQHBhcmFtIHR5cGVNYXAgW09iamVjdF0gTWFwIG9mIE1JTUUgdHlwZSAtPiBBcnJheVtleHRlbnNpb25zXVxuICogQHBhcmFtIC4uLlxuICovXG5mdW5jdGlvbiBNaW1lKCkge1xuICB0aGlzLl90eXBlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHRoaXMuX2V4dGVuc2lvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5kZWZpbmUoYXJndW1lbnRzW2ldKTtcbiAgfVxuXG4gIHRoaXMuZGVmaW5lID0gdGhpcy5kZWZpbmUuYmluZCh0aGlzKTtcbiAgdGhpcy5nZXRUeXBlID0gdGhpcy5nZXRUeXBlLmJpbmQodGhpcyk7XG4gIHRoaXMuZ2V0RXh0ZW5zaW9uID0gdGhpcy5nZXRFeHRlbnNpb24uYmluZCh0aGlzKTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgbWltZXR5cGUgLT4gZXh0ZW5zaW9uIG1hcHBpbmdzLiAgRWFjaCBrZXkgaXMgYSBtaW1lLXR5cGUgdGhhdCBtYXBzXG4gKiB0byBhbiBhcnJheSBvZiBleHRlbnNpb25zIGFzc29jaWF0ZWQgd2l0aCB0aGUgdHlwZS4gIFRoZSBmaXJzdCBleHRlbnNpb24gaXNcbiAqIHVzZWQgYXMgdGhlIGRlZmF1bHQgZXh0ZW5zaW9uIGZvciB0aGUgdHlwZS5cbiAqXG4gKiBlLmcuIG1pbWUuZGVmaW5lKHsnYXVkaW8vb2dnJywgWydvZ2EnLCAnb2dnJywgJ3NweCddfSk7XG4gKlxuICogSWYgYSB0eXBlIGRlY2xhcmVzIGFuIGV4dGVuc2lvbiB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gZGVmaW5lZCwgYW4gZXJyb3Igd2lsbFxuICogYmUgdGhyb3duLiAgVG8gc3VwcHJlc3MgdGhpcyBlcnJvciBhbmQgZm9yY2UgdGhlIGV4dGVuc2lvbiB0byBiZSBhc3NvY2lhdGVkXG4gKiB3aXRoIHRoZSBuZXcgdHlwZSwgcGFzcyBgZm9yY2VgPXRydWUuICBBbHRlcm5hdGl2ZWx5LCB5b3UgbWF5IHByZWZpeCB0aGVcbiAqIGV4dGVuc2lvbiB3aXRoIFwiKlwiIHRvIG1hcCB0aGUgdHlwZSB0byBleHRlbnNpb24sIHdpdGhvdXQgbWFwcGluZyB0aGVcbiAqIGV4dGVuc2lvbiB0byB0aGUgdHlwZS5cbiAqXG4gKiBlLmcuIG1pbWUuZGVmaW5lKHsnYXVkaW8vd2F2JywgWyd3YXYnXX0sIHsnYXVkaW8veC13YXYnLCBbJyp3YXYnXX0pO1xuICpcbiAqXG4gKiBAcGFyYW0gbWFwIChPYmplY3QpIHR5cGUgZGVmaW5pdGlvbnNcbiAqIEBwYXJhbSBmb3JjZSAoQm9vbGVhbikgaWYgdHJ1ZSwgZm9yY2Ugb3ZlcnJpZGluZyBvZiBleGlzdGluZyBkZWZpbml0aW9uc1xuICovXG5NaW1lLnByb3RvdHlwZS5kZWZpbmUgPSBmdW5jdGlvbih0eXBlTWFwLCBmb3JjZSkge1xuICBmb3IgKGxldCB0eXBlIGluIHR5cGVNYXApIHtcbiAgICBsZXQgZXh0ZW5zaW9ucyA9IHR5cGVNYXBbdHlwZV0ubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICAgIHJldHVybiB0LnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG4gICAgdHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXh0ZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZXh0ID0gZXh0ZW5zaW9uc1tpXTtcblxuICAgICAgLy8gJyonIHByZWZpeCA9IG5vdCB0aGUgcHJlZmVycmVkIHR5cGUgZm9yIHRoaXMgZXh0ZW5zaW9uLiAgU28gZml4dXAgdGhlXG4gICAgICAvLyBleHRlbnNpb24sIGFuZCBza2lwIGl0LlxuICAgICAgaWYgKGV4dFswXSA9PT0gJyonKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWZvcmNlICYmIChleHQgaW4gdGhpcy5fdHlwZXMpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQXR0ZW1wdCB0byBjaGFuZ2UgbWFwcGluZyBmb3IgXCInICsgZXh0ICtcbiAgICAgICAgICAnXCIgZXh0ZW5zaW9uIGZyb20gXCInICsgdGhpcy5fdHlwZXNbZXh0XSArICdcIiB0byBcIicgKyB0eXBlICtcbiAgICAgICAgICAnXCIuIFBhc3MgYGZvcmNlPXRydWVgIHRvIGFsbG93IHRoaXMsIG90aGVyd2lzZSByZW1vdmUgXCInICsgZXh0ICtcbiAgICAgICAgICAnXCIgZnJvbSB0aGUgbGlzdCBvZiBleHRlbnNpb25zIGZvciBcIicgKyB0eXBlICsgJ1wiLidcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdHlwZXNbZXh0XSA9IHR5cGU7XG4gICAgfVxuXG4gICAgLy8gVXNlIGZpcnN0IGV4dGVuc2lvbiBhcyBkZWZhdWx0XG4gICAgaWYgKGZvcmNlIHx8ICF0aGlzLl9leHRlbnNpb25zW3R5cGVdKSB7XG4gICAgICBjb25zdCBleHQgPSBleHRlbnNpb25zWzBdO1xuICAgICAgdGhpcy5fZXh0ZW5zaW9uc1t0eXBlXSA9IChleHRbMF0gIT09ICcqJykgPyBleHQgOiBleHQuc3Vic3RyKDEpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBMb29rdXAgYSBtaW1lIHR5cGUgYmFzZWQgb24gZXh0ZW5zaW9uXG4gKi9cbk1pbWUucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHBhdGggPSBTdHJpbmcocGF0aCk7XG4gIGxldCBsYXN0ID0gcGF0aC5yZXBsYWNlKC9eLipbL1xcXFxdLywgJycpLnRvTG93ZXJDYXNlKCk7XG4gIGxldCBleHQgPSBsYXN0LnJlcGxhY2UoL14uKlxcLi8sICcnKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGxldCBoYXNQYXRoID0gbGFzdC5sZW5ndGggPCBwYXRoLmxlbmd0aDtcbiAgbGV0IGhhc0RvdCA9IGV4dC5sZW5ndGggPCBsYXN0Lmxlbmd0aCAtIDE7XG5cbiAgcmV0dXJuIChoYXNEb3QgfHwgIWhhc1BhdGgpICYmIHRoaXMuX3R5cGVzW2V4dF0gfHwgbnVsbDtcbn07XG5cbi8qKlxuICogUmV0dXJuIGZpbGUgZXh0ZW5zaW9uIGFzc29jaWF0ZWQgd2l0aCBhIG1pbWUgdHlwZVxuICovXG5NaW1lLnByb3RvdHlwZS5nZXRFeHRlbnNpb24gPSBmdW5jdGlvbih0eXBlKSB7XG4gIHR5cGUgPSAvXlxccyooW147XFxzXSopLy50ZXN0KHR5cGUpICYmIFJlZ0V4cC4kMTtcbiAgcmV0dXJuIHR5cGUgJiYgdGhpcy5fZXh0ZW5zaW9uc1t0eXBlLnRvTG93ZXJDYXNlKCldIHx8IG51bGw7XG59O1xuXG52YXIgTWltZV8xID0gTWltZTtcblxudmFyIHN0YW5kYXJkID0ge1wiYXBwbGljYXRpb24vYW5kcmV3LWluc2V0XCI6W1wiZXpcIl0sXCJhcHBsaWNhdGlvbi9hcHBsaXh3YXJlXCI6W1wiYXdcIl0sXCJhcHBsaWNhdGlvbi9hdG9tK3htbFwiOltcImF0b21cIl0sXCJhcHBsaWNhdGlvbi9hdG9tY2F0K3htbFwiOltcImF0b21jYXRcIl0sXCJhcHBsaWNhdGlvbi9hdG9tZGVsZXRlZCt4bWxcIjpbXCJhdG9tZGVsZXRlZFwiXSxcImFwcGxpY2F0aW9uL2F0b21zdmMreG1sXCI6W1wiYXRvbXN2Y1wiXSxcImFwcGxpY2F0aW9uL2F0c2MtZHdkK3htbFwiOltcImR3ZFwiXSxcImFwcGxpY2F0aW9uL2F0c2MtaGVsZCt4bWxcIjpbXCJoZWxkXCJdLFwiYXBwbGljYXRpb24vYXRzYy1yc2F0K3htbFwiOltcInJzYXRcIl0sXCJhcHBsaWNhdGlvbi9iZG9jXCI6W1wiYmRvY1wiXSxcImFwcGxpY2F0aW9uL2NhbGVuZGFyK3htbFwiOltcInhjc1wiXSxcImFwcGxpY2F0aW9uL2NjeG1sK3htbFwiOltcImNjeG1sXCJdLFwiYXBwbGljYXRpb24vY2RmeCt4bWxcIjpbXCJjZGZ4XCJdLFwiYXBwbGljYXRpb24vY2RtaS1jYXBhYmlsaXR5XCI6W1wiY2RtaWFcIl0sXCJhcHBsaWNhdGlvbi9jZG1pLWNvbnRhaW5lclwiOltcImNkbWljXCJdLFwiYXBwbGljYXRpb24vY2RtaS1kb21haW5cIjpbXCJjZG1pZFwiXSxcImFwcGxpY2F0aW9uL2NkbWktb2JqZWN0XCI6W1wiY2RtaW9cIl0sXCJhcHBsaWNhdGlvbi9jZG1pLXF1ZXVlXCI6W1wiY2RtaXFcIl0sXCJhcHBsaWNhdGlvbi9jdS1zZWVtZVwiOltcImN1XCJdLFwiYXBwbGljYXRpb24vZGFzaCt4bWxcIjpbXCJtcGRcIl0sXCJhcHBsaWNhdGlvbi9kYXZtb3VudCt4bWxcIjpbXCJkYXZtb3VudFwiXSxcImFwcGxpY2F0aW9uL2RvY2Jvb2sreG1sXCI6W1wiZGJrXCJdLFwiYXBwbGljYXRpb24vZHNzYytkZXJcIjpbXCJkc3NjXCJdLFwiYXBwbGljYXRpb24vZHNzYyt4bWxcIjpbXCJ4ZHNzY1wiXSxcImFwcGxpY2F0aW9uL2VjbWFzY3JpcHRcIjpbXCJlY21hXCIsXCJlc1wiXSxcImFwcGxpY2F0aW9uL2VtbWEreG1sXCI6W1wiZW1tYVwiXSxcImFwcGxpY2F0aW9uL2Vtb3Rpb25tbCt4bWxcIjpbXCJlbW90aW9ubWxcIl0sXCJhcHBsaWNhdGlvbi9lcHViK3ppcFwiOltcImVwdWJcIl0sXCJhcHBsaWNhdGlvbi9leGlcIjpbXCJleGlcIl0sXCJhcHBsaWNhdGlvbi9mZHQreG1sXCI6W1wiZmR0XCJdLFwiYXBwbGljYXRpb24vZm9udC10ZHBmclwiOltcInBmclwiXSxcImFwcGxpY2F0aW9uL2dlbytqc29uXCI6W1wiZ2VvanNvblwiXSxcImFwcGxpY2F0aW9uL2dtbCt4bWxcIjpbXCJnbWxcIl0sXCJhcHBsaWNhdGlvbi9ncHgreG1sXCI6W1wiZ3B4XCJdLFwiYXBwbGljYXRpb24vZ3hmXCI6W1wiZ3hmXCJdLFwiYXBwbGljYXRpb24vZ3ppcFwiOltcImd6XCJdLFwiYXBwbGljYXRpb24vaGpzb25cIjpbXCJoanNvblwiXSxcImFwcGxpY2F0aW9uL2h5cGVyc3R1ZGlvXCI6W1wic3RrXCJdLFwiYXBwbGljYXRpb24vaW5rbWwreG1sXCI6W1wiaW5rXCIsXCJpbmttbFwiXSxcImFwcGxpY2F0aW9uL2lwZml4XCI6W1wiaXBmaXhcIl0sXCJhcHBsaWNhdGlvbi9pdHMreG1sXCI6W1wiaXRzXCJdLFwiYXBwbGljYXRpb24vamF2YS1hcmNoaXZlXCI6W1wiamFyXCIsXCJ3YXJcIixcImVhclwiXSxcImFwcGxpY2F0aW9uL2phdmEtc2VyaWFsaXplZC1vYmplY3RcIjpbXCJzZXJcIl0sXCJhcHBsaWNhdGlvbi9qYXZhLXZtXCI6W1wiY2xhc3NcIl0sXCJhcHBsaWNhdGlvbi9qYXZhc2NyaXB0XCI6W1wianNcIixcIm1qc1wiXSxcImFwcGxpY2F0aW9uL2pzb25cIjpbXCJqc29uXCIsXCJtYXBcIl0sXCJhcHBsaWNhdGlvbi9qc29uNVwiOltcImpzb241XCJdLFwiYXBwbGljYXRpb24vanNvbm1sK2pzb25cIjpbXCJqc29ubWxcIl0sXCJhcHBsaWNhdGlvbi9sZCtqc29uXCI6W1wianNvbmxkXCJdLFwiYXBwbGljYXRpb24vbGdyK3htbFwiOltcImxnclwiXSxcImFwcGxpY2F0aW9uL2xvc3QreG1sXCI6W1wibG9zdHhtbFwiXSxcImFwcGxpY2F0aW9uL21hYy1iaW5oZXg0MFwiOltcImhxeFwiXSxcImFwcGxpY2F0aW9uL21hYy1jb21wYWN0cHJvXCI6W1wiY3B0XCJdLFwiYXBwbGljYXRpb24vbWFkcyt4bWxcIjpbXCJtYWRzXCJdLFwiYXBwbGljYXRpb24vbWFuaWZlc3QranNvblwiOltcIndlYm1hbmlmZXN0XCJdLFwiYXBwbGljYXRpb24vbWFyY1wiOltcIm1yY1wiXSxcImFwcGxpY2F0aW9uL21hcmN4bWwreG1sXCI6W1wibXJjeFwiXSxcImFwcGxpY2F0aW9uL21hdGhlbWF0aWNhXCI6W1wibWFcIixcIm5iXCIsXCJtYlwiXSxcImFwcGxpY2F0aW9uL21hdGhtbCt4bWxcIjpbXCJtYXRobWxcIl0sXCJhcHBsaWNhdGlvbi9tYm94XCI6W1wibWJveFwiXSxcImFwcGxpY2F0aW9uL21lZGlhc2VydmVyY29udHJvbCt4bWxcIjpbXCJtc2NtbFwiXSxcImFwcGxpY2F0aW9uL21ldGFsaW5rK3htbFwiOltcIm1ldGFsaW5rXCJdLFwiYXBwbGljYXRpb24vbWV0YWxpbms0K3htbFwiOltcIm1ldGE0XCJdLFwiYXBwbGljYXRpb24vbWV0cyt4bWxcIjpbXCJtZXRzXCJdLFwiYXBwbGljYXRpb24vbW10LWFlaSt4bWxcIjpbXCJtYWVpXCJdLFwiYXBwbGljYXRpb24vbW10LXVzZCt4bWxcIjpbXCJtdXNkXCJdLFwiYXBwbGljYXRpb24vbW9kcyt4bWxcIjpbXCJtb2RzXCJdLFwiYXBwbGljYXRpb24vbXAyMVwiOltcIm0yMVwiLFwibXAyMVwiXSxcImFwcGxpY2F0aW9uL21wNFwiOltcIm1wNHNcIixcIm00cFwiXSxcImFwcGxpY2F0aW9uL21yYi1jb25zdW1lcit4bWxcIjpbXCIqeGRmXCJdLFwiYXBwbGljYXRpb24vbXJiLXB1Ymxpc2greG1sXCI6W1wiKnhkZlwiXSxcImFwcGxpY2F0aW9uL21zd29yZFwiOltcImRvY1wiLFwiZG90XCJdLFwiYXBwbGljYXRpb24vbXhmXCI6W1wibXhmXCJdLFwiYXBwbGljYXRpb24vbi1xdWFkc1wiOltcIm5xXCJdLFwiYXBwbGljYXRpb24vbi10cmlwbGVzXCI6W1wibnRcIl0sXCJhcHBsaWNhdGlvbi9ub2RlXCI6W1wiY2pzXCJdLFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCI6W1wiYmluXCIsXCJkbXNcIixcImxyZlwiLFwibWFyXCIsXCJzb1wiLFwiZGlzdFwiLFwiZGlzdHpcIixcInBrZ1wiLFwiYnBrXCIsXCJkdW1wXCIsXCJlbGNcIixcImRlcGxveVwiLFwiZXhlXCIsXCJkbGxcIixcImRlYlwiLFwiZG1nXCIsXCJpc29cIixcImltZ1wiLFwibXNpXCIsXCJtc3BcIixcIm1zbVwiLFwiYnVmZmVyXCJdLFwiYXBwbGljYXRpb24vb2RhXCI6W1wib2RhXCJdLFwiYXBwbGljYXRpb24vb2VicHMtcGFja2FnZSt4bWxcIjpbXCJvcGZcIl0sXCJhcHBsaWNhdGlvbi9vZ2dcIjpbXCJvZ3hcIl0sXCJhcHBsaWNhdGlvbi9vbWRvYyt4bWxcIjpbXCJvbWRvY1wiXSxcImFwcGxpY2F0aW9uL29uZW5vdGVcIjpbXCJvbmV0b2NcIixcIm9uZXRvYzJcIixcIm9uZXRtcFwiLFwib25lcGtnXCJdLFwiYXBwbGljYXRpb24vb3hwc1wiOltcIm94cHNcIl0sXCJhcHBsaWNhdGlvbi9wMnAtb3ZlcmxheSt4bWxcIjpbXCJyZWxvXCJdLFwiYXBwbGljYXRpb24vcGF0Y2gtb3BzLWVycm9yK3htbFwiOltcIip4ZXJcIl0sXCJhcHBsaWNhdGlvbi9wZGZcIjpbXCJwZGZcIl0sXCJhcHBsaWNhdGlvbi9wZ3AtZW5jcnlwdGVkXCI6W1wicGdwXCJdLFwiYXBwbGljYXRpb24vcGdwLXNpZ25hdHVyZVwiOltcImFzY1wiLFwic2lnXCJdLFwiYXBwbGljYXRpb24vcGljcy1ydWxlc1wiOltcInByZlwiXSxcImFwcGxpY2F0aW9uL3BrY3MxMFwiOltcInAxMFwiXSxcImFwcGxpY2F0aW9uL3BrY3M3LW1pbWVcIjpbXCJwN21cIixcInA3Y1wiXSxcImFwcGxpY2F0aW9uL3BrY3M3LXNpZ25hdHVyZVwiOltcInA3c1wiXSxcImFwcGxpY2F0aW9uL3BrY3M4XCI6W1wicDhcIl0sXCJhcHBsaWNhdGlvbi9wa2l4LWF0dHItY2VydFwiOltcImFjXCJdLFwiYXBwbGljYXRpb24vcGtpeC1jZXJ0XCI6W1wiY2VyXCJdLFwiYXBwbGljYXRpb24vcGtpeC1jcmxcIjpbXCJjcmxcIl0sXCJhcHBsaWNhdGlvbi9wa2l4LXBraXBhdGhcIjpbXCJwa2lwYXRoXCJdLFwiYXBwbGljYXRpb24vcGtpeGNtcFwiOltcInBraVwiXSxcImFwcGxpY2F0aW9uL3Bscyt4bWxcIjpbXCJwbHNcIl0sXCJhcHBsaWNhdGlvbi9wb3N0c2NyaXB0XCI6W1wiYWlcIixcImVwc1wiLFwicHNcIl0sXCJhcHBsaWNhdGlvbi9wcm92ZW5hbmNlK3htbFwiOltcInByb3Z4XCJdLFwiYXBwbGljYXRpb24vcHNrYyt4bWxcIjpbXCJwc2tjeG1sXCJdLFwiYXBwbGljYXRpb24vcmFtbCt5YW1sXCI6W1wicmFtbFwiXSxcImFwcGxpY2F0aW9uL3JkZit4bWxcIjpbXCJyZGZcIixcIm93bFwiXSxcImFwcGxpY2F0aW9uL3JlZ2luZm8reG1sXCI6W1wicmlmXCJdLFwiYXBwbGljYXRpb24vcmVsYXgtbmctY29tcGFjdC1zeW50YXhcIjpbXCJybmNcIl0sXCJhcHBsaWNhdGlvbi9yZXNvdXJjZS1saXN0cyt4bWxcIjpbXCJybFwiXSxcImFwcGxpY2F0aW9uL3Jlc291cmNlLWxpc3RzLWRpZmYreG1sXCI6W1wicmxkXCJdLFwiYXBwbGljYXRpb24vcmxzLXNlcnZpY2VzK3htbFwiOltcInJzXCJdLFwiYXBwbGljYXRpb24vcm91dGUtYXBkK3htbFwiOltcInJhcGRcIl0sXCJhcHBsaWNhdGlvbi9yb3V0ZS1zLXRzaWQreG1sXCI6W1wic2xzXCJdLFwiYXBwbGljYXRpb24vcm91dGUtdXNkK3htbFwiOltcInJ1c2RcIl0sXCJhcHBsaWNhdGlvbi9ycGtpLWdob3N0YnVzdGVyc1wiOltcImdiclwiXSxcImFwcGxpY2F0aW9uL3Jwa2ktbWFuaWZlc3RcIjpbXCJtZnRcIl0sXCJhcHBsaWNhdGlvbi9ycGtpLXJvYVwiOltcInJvYVwiXSxcImFwcGxpY2F0aW9uL3JzZCt4bWxcIjpbXCJyc2RcIl0sXCJhcHBsaWNhdGlvbi9yc3MreG1sXCI6W1wicnNzXCJdLFwiYXBwbGljYXRpb24vcnRmXCI6W1wicnRmXCJdLFwiYXBwbGljYXRpb24vc2JtbCt4bWxcIjpbXCJzYm1sXCJdLFwiYXBwbGljYXRpb24vc2N2cC1jdi1yZXF1ZXN0XCI6W1wic2NxXCJdLFwiYXBwbGljYXRpb24vc2N2cC1jdi1yZXNwb25zZVwiOltcInNjc1wiXSxcImFwcGxpY2F0aW9uL3NjdnAtdnAtcmVxdWVzdFwiOltcInNwcVwiXSxcImFwcGxpY2F0aW9uL3NjdnAtdnAtcmVzcG9uc2VcIjpbXCJzcHBcIl0sXCJhcHBsaWNhdGlvbi9zZHBcIjpbXCJzZHBcIl0sXCJhcHBsaWNhdGlvbi9zZW5tbCt4bWxcIjpbXCJzZW5tbHhcIl0sXCJhcHBsaWNhdGlvbi9zZW5zbWwreG1sXCI6W1wic2Vuc21seFwiXSxcImFwcGxpY2F0aW9uL3NldC1wYXltZW50LWluaXRpYXRpb25cIjpbXCJzZXRwYXlcIl0sXCJhcHBsaWNhdGlvbi9zZXQtcmVnaXN0cmF0aW9uLWluaXRpYXRpb25cIjpbXCJzZXRyZWdcIl0sXCJhcHBsaWNhdGlvbi9zaGYreG1sXCI6W1wic2hmXCJdLFwiYXBwbGljYXRpb24vc2lldmVcIjpbXCJzaXZcIixcInNpZXZlXCJdLFwiYXBwbGljYXRpb24vc21pbCt4bWxcIjpbXCJzbWlcIixcInNtaWxcIl0sXCJhcHBsaWNhdGlvbi9zcGFycWwtcXVlcnlcIjpbXCJycVwiXSxcImFwcGxpY2F0aW9uL3NwYXJxbC1yZXN1bHRzK3htbFwiOltcInNyeFwiXSxcImFwcGxpY2F0aW9uL3NyZ3NcIjpbXCJncmFtXCJdLFwiYXBwbGljYXRpb24vc3Jncyt4bWxcIjpbXCJncnhtbFwiXSxcImFwcGxpY2F0aW9uL3NydSt4bWxcIjpbXCJzcnVcIl0sXCJhcHBsaWNhdGlvbi9zc2RsK3htbFwiOltcInNzZGxcIl0sXCJhcHBsaWNhdGlvbi9zc21sK3htbFwiOltcInNzbWxcIl0sXCJhcHBsaWNhdGlvbi9zd2lkK3htbFwiOltcInN3aWR0YWdcIl0sXCJhcHBsaWNhdGlvbi90ZWkreG1sXCI6W1widGVpXCIsXCJ0ZWljb3JwdXNcIl0sXCJhcHBsaWNhdGlvbi90aHJhdWQreG1sXCI6W1widGZpXCJdLFwiYXBwbGljYXRpb24vdGltZXN0YW1wZWQtZGF0YVwiOltcInRzZFwiXSxcImFwcGxpY2F0aW9uL3RvbWxcIjpbXCJ0b21sXCJdLFwiYXBwbGljYXRpb24vdHRtbCt4bWxcIjpbXCJ0dG1sXCJdLFwiYXBwbGljYXRpb24vdWJqc29uXCI6W1widWJqXCJdLFwiYXBwbGljYXRpb24vdXJjLXJlc3NoZWV0K3htbFwiOltcInJzaGVldFwiXSxcImFwcGxpY2F0aW9uL3VyYy10YXJnZXRkZXNjK3htbFwiOltcInRkXCJdLFwiYXBwbGljYXRpb24vdm9pY2V4bWwreG1sXCI6W1widnhtbFwiXSxcImFwcGxpY2F0aW9uL3dhc21cIjpbXCJ3YXNtXCJdLFwiYXBwbGljYXRpb24vd2lkZ2V0XCI6W1wid2d0XCJdLFwiYXBwbGljYXRpb24vd2luaGxwXCI6W1wiaGxwXCJdLFwiYXBwbGljYXRpb24vd3NkbCt4bWxcIjpbXCJ3c2RsXCJdLFwiYXBwbGljYXRpb24vd3Nwb2xpY3kreG1sXCI6W1wid3Nwb2xpY3lcIl0sXCJhcHBsaWNhdGlvbi94YW1sK3htbFwiOltcInhhbWxcIl0sXCJhcHBsaWNhdGlvbi94Y2FwLWF0dCt4bWxcIjpbXCJ4YXZcIl0sXCJhcHBsaWNhdGlvbi94Y2FwLWNhcHMreG1sXCI6W1wieGNhXCJdLFwiYXBwbGljYXRpb24veGNhcC1kaWZmK3htbFwiOltcInhkZlwiXSxcImFwcGxpY2F0aW9uL3hjYXAtZWwreG1sXCI6W1wieGVsXCJdLFwiYXBwbGljYXRpb24veGNhcC1lcnJvcit4bWxcIjpbXCJ4ZXJcIl0sXCJhcHBsaWNhdGlvbi94Y2FwLW5zK3htbFwiOltcInhuc1wiXSxcImFwcGxpY2F0aW9uL3hlbmMreG1sXCI6W1wieGVuY1wiXSxcImFwcGxpY2F0aW9uL3hodG1sK3htbFwiOltcInhodG1sXCIsXCJ4aHRcIl0sXCJhcHBsaWNhdGlvbi94bGlmZit4bWxcIjpbXCJ4bGZcIl0sXCJhcHBsaWNhdGlvbi94bWxcIjpbXCJ4bWxcIixcInhzbFwiLFwieHNkXCIsXCJybmdcIl0sXCJhcHBsaWNhdGlvbi94bWwtZHRkXCI6W1wiZHRkXCJdLFwiYXBwbGljYXRpb24veG9wK3htbFwiOltcInhvcFwiXSxcImFwcGxpY2F0aW9uL3hwcm9jK3htbFwiOltcInhwbFwiXSxcImFwcGxpY2F0aW9uL3hzbHQreG1sXCI6W1wiKnhzbFwiLFwieHNsdFwiXSxcImFwcGxpY2F0aW9uL3hzcGYreG1sXCI6W1wieHNwZlwiXSxcImFwcGxpY2F0aW9uL3h2K3htbFwiOltcIm14bWxcIixcInhodm1sXCIsXCJ4dm1sXCIsXCJ4dm1cIl0sXCJhcHBsaWNhdGlvbi95YW5nXCI6W1wieWFuZ1wiXSxcImFwcGxpY2F0aW9uL3lpbit4bWxcIjpbXCJ5aW5cIl0sXCJhcHBsaWNhdGlvbi96aXBcIjpbXCJ6aXBcIl0sXCJhdWRpby8zZ3BwXCI6W1wiKjNncHBcIl0sXCJhdWRpby9hZHBjbVwiOltcImFkcFwiXSxcImF1ZGlvL2Jhc2ljXCI6W1wiYXVcIixcInNuZFwiXSxcImF1ZGlvL21pZGlcIjpbXCJtaWRcIixcIm1pZGlcIixcImthclwiLFwicm1pXCJdLFwiYXVkaW8vbW9iaWxlLXhtZlwiOltcIm14bWZcIl0sXCJhdWRpby9tcDNcIjpbXCIqbXAzXCJdLFwiYXVkaW8vbXA0XCI6W1wibTRhXCIsXCJtcDRhXCJdLFwiYXVkaW8vbXBlZ1wiOltcIm1wZ2FcIixcIm1wMlwiLFwibXAyYVwiLFwibXAzXCIsXCJtMmFcIixcIm0zYVwiXSxcImF1ZGlvL29nZ1wiOltcIm9nYVwiLFwib2dnXCIsXCJzcHhcIl0sXCJhdWRpby9zM21cIjpbXCJzM21cIl0sXCJhdWRpby9zaWxrXCI6W1wic2lsXCJdLFwiYXVkaW8vd2F2XCI6W1wid2F2XCJdLFwiYXVkaW8vd2F2ZVwiOltcIip3YXZcIl0sXCJhdWRpby93ZWJtXCI6W1wid2ViYVwiXSxcImF1ZGlvL3htXCI6W1wieG1cIl0sXCJmb250L2NvbGxlY3Rpb25cIjpbXCJ0dGNcIl0sXCJmb250L290ZlwiOltcIm90ZlwiXSxcImZvbnQvdHRmXCI6W1widHRmXCJdLFwiZm9udC93b2ZmXCI6W1wid29mZlwiXSxcImZvbnQvd29mZjJcIjpbXCJ3b2ZmMlwiXSxcImltYWdlL2FjZXNcIjpbXCJleHJcIl0sXCJpbWFnZS9hcG5nXCI6W1wiYXBuZ1wiXSxcImltYWdlL2F2aWZcIjpbXCJhdmlmXCJdLFwiaW1hZ2UvYm1wXCI6W1wiYm1wXCJdLFwiaW1hZ2UvY2dtXCI6W1wiY2dtXCJdLFwiaW1hZ2UvZGljb20tcmxlXCI6W1wiZHJsZVwiXSxcImltYWdlL2VtZlwiOltcImVtZlwiXSxcImltYWdlL2ZpdHNcIjpbXCJmaXRzXCJdLFwiaW1hZ2UvZzNmYXhcIjpbXCJnM1wiXSxcImltYWdlL2dpZlwiOltcImdpZlwiXSxcImltYWdlL2hlaWNcIjpbXCJoZWljXCJdLFwiaW1hZ2UvaGVpYy1zZXF1ZW5jZVwiOltcImhlaWNzXCJdLFwiaW1hZ2UvaGVpZlwiOltcImhlaWZcIl0sXCJpbWFnZS9oZWlmLXNlcXVlbmNlXCI6W1wiaGVpZnNcIl0sXCJpbWFnZS9oZWoya1wiOltcImhlajJcIl0sXCJpbWFnZS9oc2oyXCI6W1wiaHNqMlwiXSxcImltYWdlL2llZlwiOltcImllZlwiXSxcImltYWdlL2psc1wiOltcImpsc1wiXSxcImltYWdlL2pwMlwiOltcImpwMlwiLFwianBnMlwiXSxcImltYWdlL2pwZWdcIjpbXCJqcGVnXCIsXCJqcGdcIixcImpwZVwiXSxcImltYWdlL2pwaFwiOltcImpwaFwiXSxcImltYWdlL2pwaGNcIjpbXCJqaGNcIl0sXCJpbWFnZS9qcG1cIjpbXCJqcG1cIl0sXCJpbWFnZS9qcHhcIjpbXCJqcHhcIixcImpwZlwiXSxcImltYWdlL2p4clwiOltcImp4clwiXSxcImltYWdlL2p4cmFcIjpbXCJqeHJhXCJdLFwiaW1hZ2Uvanhyc1wiOltcImp4cnNcIl0sXCJpbWFnZS9qeHNcIjpbXCJqeHNcIl0sXCJpbWFnZS9qeHNjXCI6W1wianhzY1wiXSxcImltYWdlL2p4c2lcIjpbXCJqeHNpXCJdLFwiaW1hZ2Uvanhzc1wiOltcImp4c3NcIl0sXCJpbWFnZS9rdHhcIjpbXCJrdHhcIl0sXCJpbWFnZS9rdHgyXCI6W1wia3R4MlwiXSxcImltYWdlL3BuZ1wiOltcInBuZ1wiXSxcImltYWdlL3NnaVwiOltcInNnaVwiXSxcImltYWdlL3N2Zyt4bWxcIjpbXCJzdmdcIixcInN2Z3pcIl0sXCJpbWFnZS90MzhcIjpbXCJ0MzhcIl0sXCJpbWFnZS90aWZmXCI6W1widGlmXCIsXCJ0aWZmXCJdLFwiaW1hZ2UvdGlmZi1meFwiOltcInRmeFwiXSxcImltYWdlL3dlYnBcIjpbXCJ3ZWJwXCJdLFwiaW1hZ2Uvd21mXCI6W1wid21mXCJdLFwibWVzc2FnZS9kaXNwb3NpdGlvbi1ub3RpZmljYXRpb25cIjpbXCJkaXNwb3NpdGlvbi1ub3RpZmljYXRpb25cIl0sXCJtZXNzYWdlL2dsb2JhbFwiOltcInU4bXNnXCJdLFwibWVzc2FnZS9nbG9iYWwtZGVsaXZlcnktc3RhdHVzXCI6W1widThkc25cIl0sXCJtZXNzYWdlL2dsb2JhbC1kaXNwb3NpdGlvbi1ub3RpZmljYXRpb25cIjpbXCJ1OG1kblwiXSxcIm1lc3NhZ2UvZ2xvYmFsLWhlYWRlcnNcIjpbXCJ1OGhkclwiXSxcIm1lc3NhZ2UvcmZjODIyXCI6W1wiZW1sXCIsXCJtaW1lXCJdLFwibW9kZWwvM21mXCI6W1wiM21mXCJdLFwibW9kZWwvZ2x0Zitqc29uXCI6W1wiZ2x0ZlwiXSxcIm1vZGVsL2dsdGYtYmluYXJ5XCI6W1wiZ2xiXCJdLFwibW9kZWwvaWdlc1wiOltcImlnc1wiLFwiaWdlc1wiXSxcIm1vZGVsL21lc2hcIjpbXCJtc2hcIixcIm1lc2hcIixcInNpbG9cIl0sXCJtb2RlbC9tdGxcIjpbXCJtdGxcIl0sXCJtb2RlbC9vYmpcIjpbXCJvYmpcIl0sXCJtb2RlbC9zdGxcIjpbXCJzdGxcIl0sXCJtb2RlbC92cm1sXCI6W1wid3JsXCIsXCJ2cm1sXCJdLFwibW9kZWwveDNkK2JpbmFyeVwiOltcIip4M2RiXCIsXCJ4M2RielwiXSxcIm1vZGVsL3gzZCtmYXN0aW5mb3NldFwiOltcIngzZGJcIl0sXCJtb2RlbC94M2QrdnJtbFwiOltcIip4M2R2XCIsXCJ4M2R2elwiXSxcIm1vZGVsL3gzZCt4bWxcIjpbXCJ4M2RcIixcIngzZHpcIl0sXCJtb2RlbC94M2QtdnJtbFwiOltcIngzZHZcIl0sXCJ0ZXh0L2NhY2hlLW1hbmlmZXN0XCI6W1wiYXBwY2FjaGVcIixcIm1hbmlmZXN0XCJdLFwidGV4dC9jYWxlbmRhclwiOltcImljc1wiLFwiaWZiXCJdLFwidGV4dC9jb2ZmZWVzY3JpcHRcIjpbXCJjb2ZmZWVcIixcImxpdGNvZmZlZVwiXSxcInRleHQvY3NzXCI6W1wiY3NzXCJdLFwidGV4dC9jc3ZcIjpbXCJjc3ZcIl0sXCJ0ZXh0L2h0bWxcIjpbXCJodG1sXCIsXCJodG1cIixcInNodG1sXCJdLFwidGV4dC9qYWRlXCI6W1wiamFkZVwiXSxcInRleHQvanN4XCI6W1wianN4XCJdLFwidGV4dC9sZXNzXCI6W1wibGVzc1wiXSxcInRleHQvbWFya2Rvd25cIjpbXCJtYXJrZG93blwiLFwibWRcIl0sXCJ0ZXh0L21hdGhtbFwiOltcIm1tbFwiXSxcInRleHQvbWR4XCI6W1wibWR4XCJdLFwidGV4dC9uM1wiOltcIm4zXCJdLFwidGV4dC9wbGFpblwiOltcInR4dFwiLFwidGV4dFwiLFwiY29uZlwiLFwiZGVmXCIsXCJsaXN0XCIsXCJsb2dcIixcImluXCIsXCJpbmlcIl0sXCJ0ZXh0L3JpY2h0ZXh0XCI6W1wicnR4XCJdLFwidGV4dC9ydGZcIjpbXCIqcnRmXCJdLFwidGV4dC9zZ21sXCI6W1wic2dtbFwiLFwic2dtXCJdLFwidGV4dC9zaGV4XCI6W1wic2hleFwiXSxcInRleHQvc2xpbVwiOltcInNsaW1cIixcInNsbVwiXSxcInRleHQvc3BkeFwiOltcInNwZHhcIl0sXCJ0ZXh0L3N0eWx1c1wiOltcInN0eWx1c1wiLFwic3R5bFwiXSxcInRleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXNcIjpbXCJ0c3ZcIl0sXCJ0ZXh0L3Ryb2ZmXCI6W1widFwiLFwidHJcIixcInJvZmZcIixcIm1hblwiLFwibWVcIixcIm1zXCJdLFwidGV4dC90dXJ0bGVcIjpbXCJ0dGxcIl0sXCJ0ZXh0L3VyaS1saXN0XCI6W1widXJpXCIsXCJ1cmlzXCIsXCJ1cmxzXCJdLFwidGV4dC92Y2FyZFwiOltcInZjYXJkXCJdLFwidGV4dC92dHRcIjpbXCJ2dHRcIl0sXCJ0ZXh0L3htbFwiOltcIip4bWxcIl0sXCJ0ZXh0L3lhbWxcIjpbXCJ5YW1sXCIsXCJ5bWxcIl0sXCJ2aWRlby8zZ3BwXCI6W1wiM2dwXCIsXCIzZ3BwXCJdLFwidmlkZW8vM2dwcDJcIjpbXCIzZzJcIl0sXCJ2aWRlby9oMjYxXCI6W1wiaDI2MVwiXSxcInZpZGVvL2gyNjNcIjpbXCJoMjYzXCJdLFwidmlkZW8vaDI2NFwiOltcImgyNjRcIl0sXCJ2aWRlby9qcGVnXCI6W1wianBndlwiXSxcInZpZGVvL2pwbVwiOltcIipqcG1cIixcImpwZ21cIl0sXCJ2aWRlby9tajJcIjpbXCJtajJcIixcIm1qcDJcIl0sXCJ2aWRlby9tcDJ0XCI6W1widHNcIl0sXCJ2aWRlby9tcDRcIjpbXCJtcDRcIixcIm1wNHZcIixcIm1wZzRcIl0sXCJ2aWRlby9tcGVnXCI6W1wibXBlZ1wiLFwibXBnXCIsXCJtcGVcIixcIm0xdlwiLFwibTJ2XCJdLFwidmlkZW8vb2dnXCI6W1wib2d2XCJdLFwidmlkZW8vcXVpY2t0aW1lXCI6W1wicXRcIixcIm1vdlwiXSxcInZpZGVvL3dlYm1cIjpbXCJ3ZWJtXCJdfTtcblxudmFyIG90aGVyID0ge1wiYXBwbGljYXRpb24vcHJzLmN3d1wiOltcImN3d1wiXSxcImFwcGxpY2F0aW9uL3ZuZC4xMDAwbWluZHMuZGVjaXNpb24tbW9kZWwreG1sXCI6W1wiMWttXCJdLFwiYXBwbGljYXRpb24vdm5kLjNncHAucGljLWJ3LWxhcmdlXCI6W1wicGxiXCJdLFwiYXBwbGljYXRpb24vdm5kLjNncHAucGljLWJ3LXNtYWxsXCI6W1wicHNiXCJdLFwiYXBwbGljYXRpb24vdm5kLjNncHAucGljLWJ3LXZhclwiOltcInB2YlwiXSxcImFwcGxpY2F0aW9uL3ZuZC4zZ3BwMi50Y2FwXCI6W1widGNhcFwiXSxcImFwcGxpY2F0aW9uL3ZuZC4zbS5wb3N0LWl0LW5vdGVzXCI6W1wicHduXCJdLFwiYXBwbGljYXRpb24vdm5kLmFjY3BhYy5zaW1wbHkuYXNvXCI6W1wiYXNvXCJdLFwiYXBwbGljYXRpb24vdm5kLmFjY3BhYy5zaW1wbHkuaW1wXCI6W1wiaW1wXCJdLFwiYXBwbGljYXRpb24vdm5kLmFjdWNvYm9sXCI6W1wiYWN1XCJdLFwiYXBwbGljYXRpb24vdm5kLmFjdWNvcnBcIjpbXCJhdGNcIixcImFjdXRjXCJdLFwiYXBwbGljYXRpb24vdm5kLmFkb2JlLmFpci1hcHBsaWNhdGlvbi1pbnN0YWxsZXItcGFja2FnZSt6aXBcIjpbXCJhaXJcIl0sXCJhcHBsaWNhdGlvbi92bmQuYWRvYmUuZm9ybXNjZW50cmFsLmZjZHRcIjpbXCJmY2R0XCJdLFwiYXBwbGljYXRpb24vdm5kLmFkb2JlLmZ4cFwiOltcImZ4cFwiLFwiZnhwbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5hZG9iZS54ZHAreG1sXCI6W1wieGRwXCJdLFwiYXBwbGljYXRpb24vdm5kLmFkb2JlLnhmZGZcIjpbXCJ4ZmRmXCJdLFwiYXBwbGljYXRpb24vdm5kLmFoZWFkLnNwYWNlXCI6W1wiYWhlYWRcIl0sXCJhcHBsaWNhdGlvbi92bmQuYWlyemlwLmZpbGVzZWN1cmUuYXpmXCI6W1wiYXpmXCJdLFwiYXBwbGljYXRpb24vdm5kLmFpcnppcC5maWxlc2VjdXJlLmF6c1wiOltcImF6c1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5hbWF6b24uZWJvb2tcIjpbXCJhendcIl0sXCJhcHBsaWNhdGlvbi92bmQuYW1lcmljYW5keW5hbWljcy5hY2NcIjpbXCJhY2NcIl0sXCJhcHBsaWNhdGlvbi92bmQuYW1pZ2EuYW1pXCI6W1wiYW1pXCJdLFwiYXBwbGljYXRpb24vdm5kLmFuZHJvaWQucGFja2FnZS1hcmNoaXZlXCI6W1wiYXBrXCJdLFwiYXBwbGljYXRpb24vdm5kLmFuc2VyLXdlYi1jZXJ0aWZpY2F0ZS1pc3N1ZS1pbml0aWF0aW9uXCI6W1wiY2lpXCJdLFwiYXBwbGljYXRpb24vdm5kLmFuc2VyLXdlYi1mdW5kcy10cmFuc2Zlci1pbml0aWF0aW9uXCI6W1wiZnRpXCJdLFwiYXBwbGljYXRpb24vdm5kLmFudGl4LmdhbWUtY29tcG9uZW50XCI6W1wiYXR4XCJdLFwiYXBwbGljYXRpb24vdm5kLmFwcGxlLmluc3RhbGxlcit4bWxcIjpbXCJtcGtnXCJdLFwiYXBwbGljYXRpb24vdm5kLmFwcGxlLmtleW5vdGVcIjpbXCJrZXlcIl0sXCJhcHBsaWNhdGlvbi92bmQuYXBwbGUubXBlZ3VybFwiOltcIm0zdThcIl0sXCJhcHBsaWNhdGlvbi92bmQuYXBwbGUubnVtYmVyc1wiOltcIm51bWJlcnNcIl0sXCJhcHBsaWNhdGlvbi92bmQuYXBwbGUucGFnZXNcIjpbXCJwYWdlc1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5hcHBsZS5wa3Bhc3NcIjpbXCJwa3Bhc3NcIl0sXCJhcHBsaWNhdGlvbi92bmQuYXJpc3RhbmV0d29ya3Muc3dpXCI6W1wic3dpXCJdLFwiYXBwbGljYXRpb24vdm5kLmFzdHJhZWEtc29mdHdhcmUuaW90YVwiOltcImlvdGFcIl0sXCJhcHBsaWNhdGlvbi92bmQuYXVkaW9ncmFwaFwiOltcImFlcFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5iYWxzYW1pcS5ibW1sK3htbFwiOltcImJtbWxcIl0sXCJhcHBsaWNhdGlvbi92bmQuYmx1ZWljZS5tdWx0aXBhc3NcIjpbXCJtcG1cIl0sXCJhcHBsaWNhdGlvbi92bmQuYm1pXCI6W1wiYm1pXCJdLFwiYXBwbGljYXRpb24vdm5kLmJ1c2luZXNzb2JqZWN0c1wiOltcInJlcFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jaGVtZHJhdyt4bWxcIjpbXCJjZHhtbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jaGlwbnV0cy5rYXJhb2tlLW1tZFwiOltcIm1tZFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jaW5kZXJlbGxhXCI6W1wiY2R5XCJdLFwiYXBwbGljYXRpb24vdm5kLmNpdGF0aW9uc3R5bGVzLnN0eWxlK3htbFwiOltcImNzbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jbGF5bW9yZVwiOltcImNsYVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jbG9hbnRvLnJwOVwiOltcInJwOVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jbG9uay5jNGdyb3VwXCI6W1wiYzRnXCIsXCJjNGRcIixcImM0ZlwiLFwiYzRwXCIsXCJjNHVcIl0sXCJhcHBsaWNhdGlvbi92bmQuY2x1ZXRydXN0LmNhcnRvbW9iaWxlLWNvbmZpZ1wiOltcImMxMWFtY1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5jbHVldHJ1c3QuY2FydG9tb2JpbGUtY29uZmlnLXBrZ1wiOltcImMxMWFtelwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jb21tb25zcGFjZVwiOltcImNzcFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jb250YWN0LmNtc2dcIjpbXCJjZGJjbXNnXCJdLFwiYXBwbGljYXRpb24vdm5kLmNvc21vY2FsbGVyXCI6W1wiY21jXCJdLFwiYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXJcIjpbXCJjbGt4XCJdLFwiYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIua2V5Ym9hcmRcIjpbXCJjbGtrXCJdLFwiYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIucGFsZXR0ZVwiOltcImNsa3BcIl0sXCJhcHBsaWNhdGlvbi92bmQuY3JpY2suY2xpY2tlci50ZW1wbGF0ZVwiOltcImNsa3RcIl0sXCJhcHBsaWNhdGlvbi92bmQuY3JpY2suY2xpY2tlci53b3JkYmFua1wiOltcImNsa3dcIl0sXCJhcHBsaWNhdGlvbi92bmQuY3JpdGljYWx0b29scy53YnMreG1sXCI6W1wid2JzXCJdLFwiYXBwbGljYXRpb24vdm5kLmN0Yy1wb3NtbFwiOltcInBtbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jdXBzLXBwZFwiOltcInBwZFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jdXJsLmNhclwiOltcImNhclwiXSxcImFwcGxpY2F0aW9uL3ZuZC5jdXJsLnBjdXJsXCI6W1wicGN1cmxcIl0sXCJhcHBsaWNhdGlvbi92bmQuZGFydFwiOltcImRhcnRcIl0sXCJhcHBsaWNhdGlvbi92bmQuZGF0YS12aXNpb24ucmR6XCI6W1wicmR6XCJdLFwiYXBwbGljYXRpb24vdm5kLmRiZlwiOltcImRiZlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5kZWNlLmRhdGFcIjpbXCJ1dmZcIixcInV2dmZcIixcInV2ZFwiLFwidXZ2ZFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5kZWNlLnR0bWwreG1sXCI6W1widXZ0XCIsXCJ1dnZ0XCJdLFwiYXBwbGljYXRpb24vdm5kLmRlY2UudW5zcGVjaWZpZWRcIjpbXCJ1dnhcIixcInV2dnhcIl0sXCJhcHBsaWNhdGlvbi92bmQuZGVjZS56aXBcIjpbXCJ1dnpcIixcInV2dnpcIl0sXCJhcHBsaWNhdGlvbi92bmQuZGVub3ZvLmZjc2VsYXlvdXQtbGlua1wiOltcImZlX2xhdW5jaFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5kbmFcIjpbXCJkbmFcIl0sXCJhcHBsaWNhdGlvbi92bmQuZG9sYnkubWxwXCI6W1wibWxwXCJdLFwiYXBwbGljYXRpb24vdm5kLmRwZ3JhcGhcIjpbXCJkcGdcIl0sXCJhcHBsaWNhdGlvbi92bmQuZHJlYW1mYWN0b3J5XCI6W1wiZGZhY1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5kcy1rZXlwb2ludFwiOltcImtweHhcIl0sXCJhcHBsaWNhdGlvbi92bmQuZHZiLmFpdFwiOltcImFpdFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5kdmIuc2VydmljZVwiOltcInN2Y1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5keW5hZ2VvXCI6W1wiZ2VvXCJdLFwiYXBwbGljYXRpb24vdm5kLmVjb3dpbi5jaGFydFwiOltcIm1hZ1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5lbmxpdmVuXCI6W1wibm1sXCJdLFwiYXBwbGljYXRpb24vdm5kLmVwc29uLmVzZlwiOltcImVzZlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5lcHNvbi5tc2ZcIjpbXCJtc2ZcIl0sXCJhcHBsaWNhdGlvbi92bmQuZXBzb24ucXVpY2thbmltZVwiOltcInFhbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5lcHNvbi5zYWx0XCI6W1wic2x0XCJdLFwiYXBwbGljYXRpb24vdm5kLmVwc29uLnNzZlwiOltcInNzZlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5lc3ppZ25vMyt4bWxcIjpbXCJlczNcIixcImV0M1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5lenBpeC1hbGJ1bVwiOltcImV6MlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5lenBpeC1wYWNrYWdlXCI6W1wiZXozXCJdLFwiYXBwbGljYXRpb24vdm5kLmZkZlwiOltcImZkZlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5mZHNuLm1zZWVkXCI6W1wibXNlZWRcIl0sXCJhcHBsaWNhdGlvbi92bmQuZmRzbi5zZWVkXCI6W1wic2VlZFwiLFwiZGF0YWxlc3NcIl0sXCJhcHBsaWNhdGlvbi92bmQuZmxvZ3JhcGhpdFwiOltcImdwaFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5mbHV4dGltZS5jbGlwXCI6W1wiZnRjXCJdLFwiYXBwbGljYXRpb24vdm5kLmZyYW1lbWFrZXJcIjpbXCJmbVwiLFwiZnJhbWVcIixcIm1ha2VyXCIsXCJib29rXCJdLFwiYXBwbGljYXRpb24vdm5kLmZyb2dhbnMuZm5jXCI6W1wiZm5jXCJdLFwiYXBwbGljYXRpb24vdm5kLmZyb2dhbnMubHRmXCI6W1wibHRmXCJdLFwiYXBwbGljYXRpb24vdm5kLmZzYy53ZWJsYXVuY2hcIjpbXCJmc2NcIl0sXCJhcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5c1wiOltcIm9hc1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzMlwiOltcIm9hMlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzM1wiOltcIm9hM1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzZ3BcIjpbXCJmZzVcIl0sXCJhcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5c3Byc1wiOltcImJoMlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5mdWppeGVyb3guZGRkXCI6W1wiZGRkXCJdLFwiYXBwbGljYXRpb24vdm5kLmZ1aml4ZXJveC5kb2N1d29ya3NcIjpbXCJ4ZHdcIl0sXCJhcHBsaWNhdGlvbi92bmQuZnVqaXhlcm94LmRvY3V3b3Jrcy5iaW5kZXJcIjpbXCJ4YmRcIl0sXCJhcHBsaWNhdGlvbi92bmQuZnV6enlzaGVldFwiOltcImZ6c1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5nZW5vbWF0aXgudHV4ZWRvXCI6W1widHhkXCJdLFwiYXBwbGljYXRpb24vdm5kLmdlb2dlYnJhLmZpbGVcIjpbXCJnZ2JcIl0sXCJhcHBsaWNhdGlvbi92bmQuZ2VvZ2VicmEudG9vbFwiOltcImdndFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5nZW9tZXRyeS1leHBsb3JlclwiOltcImdleFwiLFwiZ3JlXCJdLFwiYXBwbGljYXRpb24vdm5kLmdlb25leHRcIjpbXCJneHRcIl0sXCJhcHBsaWNhdGlvbi92bmQuZ2VvcGxhblwiOltcImcyd1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5nZW9zcGFjZVwiOltcImczd1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5nbXhcIjpbXCJnbXhcIl0sXCJhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWFwcHMuZG9jdW1lbnRcIjpbXCJnZG9jXCJdLFwiYXBwbGljYXRpb24vdm5kLmdvb2dsZS1hcHBzLnByZXNlbnRhdGlvblwiOltcImdzbGlkZXNcIl0sXCJhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWFwcHMuc3ByZWFkc2hlZXRcIjpbXCJnc2hlZXRcIl0sXCJhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWVhcnRoLmttbCt4bWxcIjpbXCJrbWxcIl0sXCJhcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWVhcnRoLmttelwiOltcImttelwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ncmFmZXFcIjpbXCJncWZcIixcImdxc1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtYWNjb3VudFwiOltcImdhY1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtaGVscFwiOltcImdoZlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtaWRlbnRpdHktbWVzc2FnZVwiOltcImdpbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtaW5qZWN0b3JcIjpbXCJncnZcIl0sXCJhcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLXRvb2wtbWVzc2FnZVwiOltcImd0bVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtdG9vbC10ZW1wbGF0ZVwiOltcInRwbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtdmNhcmRcIjpbXCJ2Y2dcIl0sXCJhcHBsaWNhdGlvbi92bmQuaGFsK3htbFwiOltcImhhbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5oYW5kaGVsZC1lbnRlcnRhaW5tZW50K3htbFwiOltcInptbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5oYmNpXCI6W1wiaGJjaVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5oaGUubGVzc29uLXBsYXllclwiOltcImxlc1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5ocC1ocGdsXCI6W1wiaHBnbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ocC1ocGlkXCI6W1wiaHBpZFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ocC1ocHNcIjpbXCJocHNcIl0sXCJhcHBsaWNhdGlvbi92bmQuaHAtamx5dFwiOltcImpsdFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ocC1wY2xcIjpbXCJwY2xcIl0sXCJhcHBsaWNhdGlvbi92bmQuaHAtcGNseGxcIjpbXCJwY2x4bFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5oeWRyb3N0YXRpeC5zb2YtZGF0YVwiOltcInNmZC1oZHN0eFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5pYm0ubWluaXBheVwiOltcIm1weVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5pYm0ubW9kY2FwXCI6W1wiYWZwXCIsXCJsaXN0YWZwXCIsXCJsaXN0MzgyMFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5pYm0ucmlnaHRzLW1hbmFnZW1lbnRcIjpbXCJpcm1cIl0sXCJhcHBsaWNhdGlvbi92bmQuaWJtLnNlY3VyZS1jb250YWluZXJcIjpbXCJzY1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5pY2Nwcm9maWxlXCI6W1wiaWNjXCIsXCJpY21cIl0sXCJhcHBsaWNhdGlvbi92bmQuaWdsb2FkZXJcIjpbXCJpZ2xcIl0sXCJhcHBsaWNhdGlvbi92bmQuaW1tZXJ2aXNpb24taXZwXCI6W1wiaXZwXCJdLFwiYXBwbGljYXRpb24vdm5kLmltbWVydmlzaW9uLWl2dVwiOltcIml2dVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5pbnNvcnMuaWdtXCI6W1wiaWdtXCJdLFwiYXBwbGljYXRpb24vdm5kLmludGVyY29uLmZvcm1uZXRcIjpbXCJ4cHdcIixcInhweFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5pbnRlcmdlb1wiOltcImkyZ1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5pbnR1LnFib1wiOltcInFib1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5pbnR1LnFmeFwiOltcInFmeFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5pcHVucGx1Z2dlZC5yY3Byb2ZpbGVcIjpbXCJyY3Byb2ZpbGVcIl0sXCJhcHBsaWNhdGlvbi92bmQuaXJlcG9zaXRvcnkucGFja2FnZSt4bWxcIjpbXCJpcnBcIl0sXCJhcHBsaWNhdGlvbi92bmQuaXMteHByXCI6W1wieHByXCJdLFwiYXBwbGljYXRpb24vdm5kLmlzYWMuZmNzXCI6W1wiZmNzXCJdLFwiYXBwbGljYXRpb24vdm5kLmphbVwiOltcImphbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5qY3AuamF2YW1lLm1pZGxldC1ybXNcIjpbXCJybXNcIl0sXCJhcHBsaWNhdGlvbi92bmQuamlzcFwiOltcImppc3BcIl0sXCJhcHBsaWNhdGlvbi92bmQuam9vc3Quam9kYS1hcmNoaXZlXCI6W1wiam9kYVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5rYWhvb3R6XCI6W1wia3R6XCIsXCJrdHJcIl0sXCJhcHBsaWNhdGlvbi92bmQua2RlLmthcmJvblwiOltcImthcmJvblwiXSxcImFwcGxpY2F0aW9uL3ZuZC5rZGUua2NoYXJ0XCI6W1wiY2hydFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5rZGUua2Zvcm11bGFcIjpbXCJrZm9cIl0sXCJhcHBsaWNhdGlvbi92bmQua2RlLmtpdmlvXCI6W1wiZmx3XCJdLFwiYXBwbGljYXRpb24vdm5kLmtkZS5rb250b3VyXCI6W1wia29uXCJdLFwiYXBwbGljYXRpb24vdm5kLmtkZS5rcHJlc2VudGVyXCI6W1wia3ByXCIsXCJrcHRcIl0sXCJhcHBsaWNhdGlvbi92bmQua2RlLmtzcHJlYWRcIjpbXCJrc3BcIl0sXCJhcHBsaWNhdGlvbi92bmQua2RlLmt3b3JkXCI6W1wia3dkXCIsXCJrd3RcIl0sXCJhcHBsaWNhdGlvbi92bmQua2VuYW1lYWFwcFwiOltcImh0a2VcIl0sXCJhcHBsaWNhdGlvbi92bmQua2lkc3BpcmF0aW9uXCI6W1wia2lhXCJdLFwiYXBwbGljYXRpb24vdm5kLmtpbmFyXCI6W1wia25lXCIsXCJrbnBcIl0sXCJhcHBsaWNhdGlvbi92bmQua29hblwiOltcInNrcFwiLFwic2tkXCIsXCJza3RcIixcInNrbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5rb2Rhay1kZXNjcmlwdG9yXCI6W1wic3NlXCJdLFwiYXBwbGljYXRpb24vdm5kLmxhcy5sYXMreG1sXCI6W1wibGFzeG1sXCJdLFwiYXBwbGljYXRpb24vdm5kLmxsYW1hZ3JhcGhpY3MubGlmZS1iYWxhbmNlLmRlc2t0b3BcIjpbXCJsYmRcIl0sXCJhcHBsaWNhdGlvbi92bmQubGxhbWFncmFwaGljcy5saWZlLWJhbGFuY2UuZXhjaGFuZ2UreG1sXCI6W1wibGJlXCJdLFwiYXBwbGljYXRpb24vdm5kLmxvdHVzLTEtMi0zXCI6W1wiMTIzXCJdLFwiYXBwbGljYXRpb24vdm5kLmxvdHVzLWFwcHJvYWNoXCI6W1wiYXByXCJdLFwiYXBwbGljYXRpb24vdm5kLmxvdHVzLWZyZWVsYW5jZVwiOltcInByZVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5sb3R1cy1ub3Rlc1wiOltcIm5zZlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5sb3R1cy1vcmdhbml6ZXJcIjpbXCJvcmdcIl0sXCJhcHBsaWNhdGlvbi92bmQubG90dXMtc2NyZWVuY2FtXCI6W1wic2NtXCJdLFwiYXBwbGljYXRpb24vdm5kLmxvdHVzLXdvcmRwcm9cIjpbXCJsd3BcIl0sXCJhcHBsaWNhdGlvbi92bmQubWFjcG9ydHMucG9ydHBrZ1wiOltcInBvcnRwa2dcIl0sXCJhcHBsaWNhdGlvbi92bmQubWNkXCI6W1wibWNkXCJdLFwiYXBwbGljYXRpb24vdm5kLm1lZGNhbGNkYXRhXCI6W1wibWMxXCJdLFwiYXBwbGljYXRpb24vdm5kLm1lZGlhc3RhdGlvbi5jZGtleVwiOltcImNka2V5XCJdLFwiYXBwbGljYXRpb24vdm5kLm1mZXJcIjpbXCJtd2ZcIl0sXCJhcHBsaWNhdGlvbi92bmQubWZtcFwiOltcIm1mbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5taWNyb2dyYWZ4LmZsb1wiOltcImZsb1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5taWNyb2dyYWZ4LmlneFwiOltcImlneFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5taWZcIjpbXCJtaWZcIl0sXCJhcHBsaWNhdGlvbi92bmQubW9iaXVzLmRhZlwiOltcImRhZlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tb2JpdXMuZGlzXCI6W1wiZGlzXCJdLFwiYXBwbGljYXRpb24vdm5kLm1vYml1cy5tYmtcIjpbXCJtYmtcIl0sXCJhcHBsaWNhdGlvbi92bmQubW9iaXVzLm1xeVwiOltcIm1xeVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tb2JpdXMubXNsXCI6W1wibXNsXCJdLFwiYXBwbGljYXRpb24vdm5kLm1vYml1cy5wbGNcIjpbXCJwbGNcIl0sXCJhcHBsaWNhdGlvbi92bmQubW9iaXVzLnR4ZlwiOltcInR4ZlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tb3BodW4uYXBwbGljYXRpb25cIjpbXCJtcG5cIl0sXCJhcHBsaWNhdGlvbi92bmQubW9waHVuLmNlcnRpZmljYXRlXCI6W1wibXBjXCJdLFwiYXBwbGljYXRpb24vdm5kLm1vemlsbGEueHVsK3htbFwiOltcInh1bFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tcy1hcnRnYWxyeVwiOltcImNpbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tcy1jYWItY29tcHJlc3NlZFwiOltcImNhYlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbFwiOltcInhsc1wiLFwieGxtXCIsXCJ4bGFcIixcInhsY1wiLFwieGx0XCIsXCJ4bHdcIl0sXCJhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuYWRkaW4ubWFjcm9lbmFibGVkLjEyXCI6W1wieGxhbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5iaW5hcnkubWFjcm9lbmFibGVkLjEyXCI6W1wieGxzYlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5tYWNyb2VuYWJsZWQuMTJcIjpbXCJ4bHNtXCJdLFwiYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMlwiOltcInhsdG1cIl0sXCJhcHBsaWNhdGlvbi92bmQubXMtZm9udG9iamVjdFwiOltcImVvdFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tcy1odG1saGVscFwiOltcImNobVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tcy1pbXNcIjpbXCJpbXNcIl0sXCJhcHBsaWNhdGlvbi92bmQubXMtbHJtXCI6W1wibHJtXCJdLFwiYXBwbGljYXRpb24vdm5kLm1zLW9mZmljZXRoZW1lXCI6W1widGhteFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tcy1vdXRsb29rXCI6W1wibXNnXCJdLFwiYXBwbGljYXRpb24vdm5kLm1zLXBraS5zZWNjYXRcIjpbXCJjYXRcIl0sXCJhcHBsaWNhdGlvbi92bmQubXMtcGtpLnN0bFwiOltcIipzdGxcIl0sXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludFwiOltcInBwdFwiLFwicHBzXCIsXCJwb3RcIl0sXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5hZGRpbi5tYWNyb2VuYWJsZWQuMTJcIjpbXCJwcGFtXCJdLFwiYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQucHJlc2VudGF0aW9uLm1hY3JvZW5hYmxlZC4xMlwiOltcInBwdG1cIl0sXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5zbGlkZS5tYWNyb2VuYWJsZWQuMTJcIjpbXCJzbGRtXCJdLFwiYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQuc2xpZGVzaG93Lm1hY3JvZW5hYmxlZC4xMlwiOltcInBwc21cIl0sXCJhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC50ZW1wbGF0ZS5tYWNyb2VuYWJsZWQuMTJcIjpbXCJwb3RtXCJdLFwiYXBwbGljYXRpb24vdm5kLm1zLXByb2plY3RcIjpbXCJtcHBcIixcIm1wdFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLmRvY3VtZW50Lm1hY3JvZW5hYmxlZC4xMlwiOltcImRvY21cIl0sXCJhcHBsaWNhdGlvbi92bmQubXMtd29yZC50ZW1wbGF0ZS5tYWNyb2VuYWJsZWQuMTJcIjpbXCJkb3RtXCJdLFwiYXBwbGljYXRpb24vdm5kLm1zLXdvcmtzXCI6W1wid3BzXCIsXCJ3a3NcIixcIndjbVwiLFwid2RiXCJdLFwiYXBwbGljYXRpb24vdm5kLm1zLXdwbFwiOltcIndwbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tcy14cHNkb2N1bWVudFwiOltcInhwc1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5tc2VxXCI6W1wibXNlcVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5tdXNpY2lhblwiOltcIm11c1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5tdXZlZS5zdHlsZVwiOltcIm1zdHlcIl0sXCJhcHBsaWNhdGlvbi92bmQubXluZmNcIjpbXCJ0YWdsZXRcIl0sXCJhcHBsaWNhdGlvbi92bmQubmV1cm9sYW5ndWFnZS5ubHVcIjpbXCJubHVcIl0sXCJhcHBsaWNhdGlvbi92bmQubml0ZlwiOltcIm50ZlwiLFwibml0ZlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ub2JsZW5ldC1kaXJlY3RvcnlcIjpbXCJubmRcIl0sXCJhcHBsaWNhdGlvbi92bmQubm9ibGVuZXQtc2VhbGVyXCI6W1wibm5zXCJdLFwiYXBwbGljYXRpb24vdm5kLm5vYmxlbmV0LXdlYlwiOltcIm5ud1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5uLWdhZ2UuYWMreG1sXCI6W1wiKmFjXCJdLFwiYXBwbGljYXRpb24vdm5kLm5va2lhLm4tZ2FnZS5kYXRhXCI6W1wibmdkYXRcIl0sXCJhcHBsaWNhdGlvbi92bmQubm9raWEubi1nYWdlLnN5bWJpYW4uaW5zdGFsbFwiOltcIm4tZ2FnZVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5yYWRpby1wcmVzZXRcIjpbXCJycHN0XCJdLFwiYXBwbGljYXRpb24vdm5kLm5va2lhLnJhZGlvLXByZXNldHNcIjpbXCJycHNzXCJdLFwiYXBwbGljYXRpb24vdm5kLm5vdmFkaWdtLmVkbVwiOltcImVkbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5ub3ZhZGlnbS5lZHhcIjpbXCJlZHhcIl0sXCJhcHBsaWNhdGlvbi92bmQubm92YWRpZ20uZXh0XCI6W1wiZXh0XCJdLFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5jaGFydFwiOltcIm9kY1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuY2hhcnQtdGVtcGxhdGVcIjpbXCJvdGNcIl0sXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmRhdGFiYXNlXCI6W1wib2RiXCJdLFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5mb3JtdWxhXCI6W1wib2RmXCJdLFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5mb3JtdWxhLXRlbXBsYXRlXCI6W1wib2RmdFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZ3JhcGhpY3NcIjpbXCJvZGdcIl0sXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmdyYXBoaWNzLXRlbXBsYXRlXCI6W1wib3RnXCJdLFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5pbWFnZVwiOltcIm9kaVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuaW1hZ2UtdGVtcGxhdGVcIjpbXCJvdGlcIl0sXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvblwiOltcIm9kcFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQucHJlc2VudGF0aW9uLXRlbXBsYXRlXCI6W1wib3RwXCJdLFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldFwiOltcIm9kc1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuc3ByZWFkc2hlZXQtdGVtcGxhdGVcIjpbXCJvdHNcIl0sXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHRcIjpbXCJvZHRcIl0sXCJhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQtbWFzdGVyXCI6W1wib2RtXCJdLFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0LXRlbXBsYXRlXCI6W1wib3R0XCJdLFwiYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0LXdlYlwiOltcIm90aFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5vbHBjLXN1Z2FyXCI6W1wieG9cIl0sXCJhcHBsaWNhdGlvbi92bmQub21hLmRkMit4bWxcIjpbXCJkZDJcIl0sXCJhcHBsaWNhdGlvbi92bmQub3BlbmJsb3guZ2FtZSt4bWxcIjpbXCJvYmd4XCJdLFwiYXBwbGljYXRpb24vdm5kLm9wZW5vZmZpY2VvcmcuZXh0ZW5zaW9uXCI6W1wib3h0XCJdLFwiYXBwbGljYXRpb24vdm5kLm9wZW5zdHJlZXRtYXAuZGF0YSt4bWxcIjpbXCJvc21cIl0sXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwucHJlc2VudGF0aW9uXCI6W1wicHB0eFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5zbGlkZVwiOltcInNsZHhcIl0sXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuc2xpZGVzaG93XCI6W1wicHBzeFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC50ZW1wbGF0ZVwiOltcInBvdHhcIl0sXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldFwiOltcInhsc3hcIl0sXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC50ZW1wbGF0ZVwiOltcInhsdHhcIl0sXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudFwiOltcImRvY3hcIl0sXCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC50ZW1wbGF0ZVwiOltcImRvdHhcIl0sXCJhcHBsaWNhdGlvbi92bmQub3NnZW8ubWFwZ3VpZGUucGFja2FnZVwiOltcIm1ncFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5vc2dpLmRwXCI6W1wiZHBcIl0sXCJhcHBsaWNhdGlvbi92bmQub3NnaS5zdWJzeXN0ZW1cIjpbXCJlc2FcIl0sXCJhcHBsaWNhdGlvbi92bmQucGFsbVwiOltcInBkYlwiLFwicHFhXCIsXCJvcHJjXCJdLFwiYXBwbGljYXRpb24vdm5kLnBhd2FhZmlsZVwiOltcInBhd1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5wZy5mb3JtYXRcIjpbXCJzdHJcIl0sXCJhcHBsaWNhdGlvbi92bmQucGcub3Nhc2xpXCI6W1wiZWk2XCJdLFwiYXBwbGljYXRpb24vdm5kLnBpY3NlbFwiOltcImVmaWZcIl0sXCJhcHBsaWNhdGlvbi92bmQucG1pLndpZGdldFwiOltcIndnXCJdLFwiYXBwbGljYXRpb24vdm5kLnBvY2tldGxlYXJuXCI6W1wicGxmXCJdLFwiYXBwbGljYXRpb24vdm5kLnBvd2VyYnVpbGRlcjZcIjpbXCJwYmRcIl0sXCJhcHBsaWNhdGlvbi92bmQucHJldmlld3N5c3RlbXMuYm94XCI6W1wiYm94XCJdLFwiYXBwbGljYXRpb24vdm5kLnByb3RldXMubWFnYXppbmVcIjpbXCJtZ3pcIl0sXCJhcHBsaWNhdGlvbi92bmQucHVibGlzaGFyZS1kZWx0YS10cmVlXCI6W1wicXBzXCJdLFwiYXBwbGljYXRpb24vdm5kLnB2aS5wdGlkMVwiOltcInB0aWRcIl0sXCJhcHBsaWNhdGlvbi92bmQucXVhcmsucXVhcmt4cHJlc3NcIjpbXCJxeGRcIixcInF4dFwiLFwicXdkXCIsXCJxd3RcIixcInF4bFwiLFwicXhiXCJdLFwiYXBwbGljYXRpb24vdm5kLnJhclwiOltcInJhclwiXSxcImFwcGxpY2F0aW9uL3ZuZC5yZWFsdm5jLmJlZFwiOltcImJlZFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5yZWNvcmRhcmUubXVzaWN4bWxcIjpbXCJteGxcIl0sXCJhcHBsaWNhdGlvbi92bmQucmVjb3JkYXJlLm11c2ljeG1sK3htbFwiOltcIm11c2ljeG1sXCJdLFwiYXBwbGljYXRpb24vdm5kLnJpZy5jcnlwdG9ub3RlXCI6W1wiY3J5cHRvbm90ZVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5yaW0uY29kXCI6W1wiY29kXCJdLFwiYXBwbGljYXRpb24vdm5kLnJuLXJlYWxtZWRpYVwiOltcInJtXCJdLFwiYXBwbGljYXRpb24vdm5kLnJuLXJlYWxtZWRpYS12YnJcIjpbXCJybXZiXCJdLFwiYXBwbGljYXRpb24vdm5kLnJvdXRlNjYubGluazY2K3htbFwiOltcImxpbms2NlwiXSxcImFwcGxpY2F0aW9uL3ZuZC5zYWlsaW5ndHJhY2tlci50cmFja1wiOltcInN0XCJdLFwiYXBwbGljYXRpb24vdm5kLnNlZW1haWxcIjpbXCJzZWVcIl0sXCJhcHBsaWNhdGlvbi92bmQuc2VtYVwiOltcInNlbWFcIl0sXCJhcHBsaWNhdGlvbi92bmQuc2VtZFwiOltcInNlbWRcIl0sXCJhcHBsaWNhdGlvbi92bmQuc2VtZlwiOltcInNlbWZcIl0sXCJhcHBsaWNhdGlvbi92bmQuc2hhbmEuaW5mb3JtZWQuZm9ybWRhdGFcIjpbXCJpZm1cIl0sXCJhcHBsaWNhdGlvbi92bmQuc2hhbmEuaW5mb3JtZWQuZm9ybXRlbXBsYXRlXCI6W1wiaXRwXCJdLFwiYXBwbGljYXRpb24vdm5kLnNoYW5hLmluZm9ybWVkLmludGVyY2hhbmdlXCI6W1wiaWlmXCJdLFwiYXBwbGljYXRpb24vdm5kLnNoYW5hLmluZm9ybWVkLnBhY2thZ2VcIjpbXCJpcGtcIl0sXCJhcHBsaWNhdGlvbi92bmQuc2ltdGVjaC1taW5kbWFwcGVyXCI6W1widHdkXCIsXCJ0d2RzXCJdLFwiYXBwbGljYXRpb24vdm5kLnNtYWZcIjpbXCJtbWZcIl0sXCJhcHBsaWNhdGlvbi92bmQuc21hcnQudGVhY2hlclwiOltcInRlYWNoZXJcIl0sXCJhcHBsaWNhdGlvbi92bmQuc29mdHdhcmU2MDIuZmlsbGVyLmZvcm0reG1sXCI6W1wiZm9cIl0sXCJhcHBsaWNhdGlvbi92bmQuc29sZW50LnNka20reG1sXCI6W1wic2RrbVwiLFwic2RrZFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5zcG90ZmlyZS5keHBcIjpbXCJkeHBcIl0sXCJhcHBsaWNhdGlvbi92bmQuc3BvdGZpcmUuc2ZzXCI6W1wic2ZzXCJdLFwiYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5jYWxjXCI6W1wic2RjXCJdLFwiYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5kcmF3XCI6W1wic2RhXCJdLFwiYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5pbXByZXNzXCI6W1wic2RkXCJdLFwiYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5tYXRoXCI6W1wic21mXCJdLFwiYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi53cml0ZXJcIjpbXCJzZHdcIixcInZvclwiXSxcImFwcGxpY2F0aW9uL3ZuZC5zdGFyZGl2aXNpb24ud3JpdGVyLWdsb2JhbFwiOltcInNnbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5zdGVwbWFuaWEucGFja2FnZVwiOltcInNtemlwXCJdLFwiYXBwbGljYXRpb24vdm5kLnN0ZXBtYW5pYS5zdGVwY2hhcnRcIjpbXCJzbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5zdW4ud2FkbCt4bWxcIjpbXCJ3YWRsXCJdLFwiYXBwbGljYXRpb24vdm5kLnN1bi54bWwuY2FsY1wiOltcInN4Y1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmNhbGMudGVtcGxhdGVcIjpbXCJzdGNcIl0sXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5kcmF3XCI6W1wic3hkXCJdLFwiYXBwbGljYXRpb24vdm5kLnN1bi54bWwuZHJhdy50ZW1wbGF0ZVwiOltcInN0ZFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmltcHJlc3NcIjpbXCJzeGlcIl0sXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5pbXByZXNzLnRlbXBsYXRlXCI6W1wic3RpXCJdLFwiYXBwbGljYXRpb24vdm5kLnN1bi54bWwubWF0aFwiOltcInN4bVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLndyaXRlclwiOltcInN4d1wiXSxcImFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLndyaXRlci5nbG9iYWxcIjpbXCJzeGdcIl0sXCJhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC53cml0ZXIudGVtcGxhdGVcIjpbXCJzdHdcIl0sXCJhcHBsaWNhdGlvbi92bmQuc3VzLWNhbGVuZGFyXCI6W1wic3VzXCIsXCJzdXNwXCJdLFwiYXBwbGljYXRpb24vdm5kLnN2ZFwiOltcInN2ZFwiXSxcImFwcGxpY2F0aW9uL3ZuZC5zeW1iaWFuLmluc3RhbGxcIjpbXCJzaXNcIixcInNpc3hcIl0sXCJhcHBsaWNhdGlvbi92bmQuc3luY21sK3htbFwiOltcInhzbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5zeW5jbWwuZG0rd2J4bWxcIjpbXCJiZG1cIl0sXCJhcHBsaWNhdGlvbi92bmQuc3luY21sLmRtK3htbFwiOltcInhkbVwiXSxcImFwcGxpY2F0aW9uL3ZuZC5zeW5jbWwuZG1kZGYreG1sXCI6W1wiZGRmXCJdLFwiYXBwbGljYXRpb24vdm5kLnRhby5pbnRlbnQtbW9kdWxlLWFyY2hpdmVcIjpbXCJ0YW9cIl0sXCJhcHBsaWNhdGlvbi92bmQudGNwZHVtcC5wY2FwXCI6W1wicGNhcFwiLFwiY2FwXCIsXCJkbXBcIl0sXCJhcHBsaWNhdGlvbi92bmQudG1vYmlsZS1saXZldHZcIjpbXCJ0bW9cIl0sXCJhcHBsaWNhdGlvbi92bmQudHJpZC50cHRcIjpbXCJ0cHRcIl0sXCJhcHBsaWNhdGlvbi92bmQudHJpc2NhcGUubXhzXCI6W1wibXhzXCJdLFwiYXBwbGljYXRpb24vdm5kLnRydWVhcHBcIjpbXCJ0cmFcIl0sXCJhcHBsaWNhdGlvbi92bmQudWZkbFwiOltcInVmZFwiLFwidWZkbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC51aXEudGhlbWVcIjpbXCJ1dHpcIl0sXCJhcHBsaWNhdGlvbi92bmQudW1hamluXCI6W1widW1qXCJdLFwiYXBwbGljYXRpb24vdm5kLnVuaXR5XCI6W1widW5pdHl3ZWJcIl0sXCJhcHBsaWNhdGlvbi92bmQudW9tbCt4bWxcIjpbXCJ1b21sXCJdLFwiYXBwbGljYXRpb24vdm5kLnZjeFwiOltcInZjeFwiXSxcImFwcGxpY2F0aW9uL3ZuZC52aXNpb1wiOltcInZzZFwiLFwidnN0XCIsXCJ2c3NcIixcInZzd1wiXSxcImFwcGxpY2F0aW9uL3ZuZC52aXNpb25hcnlcIjpbXCJ2aXNcIl0sXCJhcHBsaWNhdGlvbi92bmQudnNmXCI6W1widnNmXCJdLFwiYXBwbGljYXRpb24vdm5kLndhcC53YnhtbFwiOltcIndieG1sXCJdLFwiYXBwbGljYXRpb24vdm5kLndhcC53bWxjXCI6W1wid21sY1wiXSxcImFwcGxpY2F0aW9uL3ZuZC53YXAud21sc2NyaXB0Y1wiOltcIndtbHNjXCJdLFwiYXBwbGljYXRpb24vdm5kLndlYnR1cmJvXCI6W1wid3RiXCJdLFwiYXBwbGljYXRpb24vdm5kLndvbGZyYW0ucGxheWVyXCI6W1wibmJwXCJdLFwiYXBwbGljYXRpb24vdm5kLndvcmRwZXJmZWN0XCI6W1wid3BkXCJdLFwiYXBwbGljYXRpb24vdm5kLndxZFwiOltcIndxZFwiXSxcImFwcGxpY2F0aW9uL3ZuZC53dC5zdGZcIjpbXCJzdGZcIl0sXCJhcHBsaWNhdGlvbi92bmQueGFyYVwiOltcInhhclwiXSxcImFwcGxpY2F0aW9uL3ZuZC54ZmRsXCI6W1wieGZkbFwiXSxcImFwcGxpY2F0aW9uL3ZuZC55YW1haGEuaHYtZGljXCI6W1wiaHZkXCJdLFwiYXBwbGljYXRpb24vdm5kLnlhbWFoYS5odi1zY3JpcHRcIjpbXCJodnNcIl0sXCJhcHBsaWNhdGlvbi92bmQueWFtYWhhLmh2LXZvaWNlXCI6W1wiaHZwXCJdLFwiYXBwbGljYXRpb24vdm5kLnlhbWFoYS5vcGVuc2NvcmVmb3JtYXRcIjpbXCJvc2ZcIl0sXCJhcHBsaWNhdGlvbi92bmQueWFtYWhhLm9wZW5zY29yZWZvcm1hdC5vc2ZwdmcreG1sXCI6W1wib3NmcHZnXCJdLFwiYXBwbGljYXRpb24vdm5kLnlhbWFoYS5zbWFmLWF1ZGlvXCI6W1wic2FmXCJdLFwiYXBwbGljYXRpb24vdm5kLnlhbWFoYS5zbWFmLXBocmFzZVwiOltcInNwZlwiXSxcImFwcGxpY2F0aW9uL3ZuZC55ZWxsb3dyaXZlci1jdXN0b20tbWVudVwiOltcImNtcFwiXSxcImFwcGxpY2F0aW9uL3ZuZC56dWxcIjpbXCJ6aXJcIixcInppcnpcIl0sXCJhcHBsaWNhdGlvbi92bmQuenphenouZGVjayt4bWxcIjpbXCJ6YXpcIl0sXCJhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWRcIjpbXCI3elwiXSxcImFwcGxpY2F0aW9uL3gtYWJpd29yZFwiOltcImFid1wiXSxcImFwcGxpY2F0aW9uL3gtYWNlLWNvbXByZXNzZWRcIjpbXCJhY2VcIl0sXCJhcHBsaWNhdGlvbi94LWFwcGxlLWRpc2tpbWFnZVwiOltcIipkbWdcIl0sXCJhcHBsaWNhdGlvbi94LWFyalwiOltcImFyalwiXSxcImFwcGxpY2F0aW9uL3gtYXV0aG9yd2FyZS1iaW5cIjpbXCJhYWJcIixcIngzMlwiLFwidTMyXCIsXCJ2b3hcIl0sXCJhcHBsaWNhdGlvbi94LWF1dGhvcndhcmUtbWFwXCI6W1wiYWFtXCJdLFwiYXBwbGljYXRpb24veC1hdXRob3J3YXJlLXNlZ1wiOltcImFhc1wiXSxcImFwcGxpY2F0aW9uL3gtYmNwaW9cIjpbXCJiY3Bpb1wiXSxcImFwcGxpY2F0aW9uL3gtYmRvY1wiOltcIipiZG9jXCJdLFwiYXBwbGljYXRpb24veC1iaXR0b3JyZW50XCI6W1widG9ycmVudFwiXSxcImFwcGxpY2F0aW9uL3gtYmxvcmJcIjpbXCJibGJcIixcImJsb3JiXCJdLFwiYXBwbGljYXRpb24veC1iemlwXCI6W1wiYnpcIl0sXCJhcHBsaWNhdGlvbi94LWJ6aXAyXCI6W1wiYnoyXCIsXCJib3pcIl0sXCJhcHBsaWNhdGlvbi94LWNiclwiOltcImNiclwiLFwiY2JhXCIsXCJjYnRcIixcImNielwiLFwiY2I3XCJdLFwiYXBwbGljYXRpb24veC1jZGxpbmtcIjpbXCJ2Y2RcIl0sXCJhcHBsaWNhdGlvbi94LWNmcy1jb21wcmVzc2VkXCI6W1wiY2ZzXCJdLFwiYXBwbGljYXRpb24veC1jaGF0XCI6W1wiY2hhdFwiXSxcImFwcGxpY2F0aW9uL3gtY2hlc3MtcGduXCI6W1wicGduXCJdLFwiYXBwbGljYXRpb24veC1jaHJvbWUtZXh0ZW5zaW9uXCI6W1wiY3J4XCJdLFwiYXBwbGljYXRpb24veC1jb2NvYVwiOltcImNjb1wiXSxcImFwcGxpY2F0aW9uL3gtY29uZmVyZW5jZVwiOltcIm5zY1wiXSxcImFwcGxpY2F0aW9uL3gtY3Bpb1wiOltcImNwaW9cIl0sXCJhcHBsaWNhdGlvbi94LWNzaFwiOltcImNzaFwiXSxcImFwcGxpY2F0aW9uL3gtZGViaWFuLXBhY2thZ2VcIjpbXCIqZGViXCIsXCJ1ZGViXCJdLFwiYXBwbGljYXRpb24veC1kZ2MtY29tcHJlc3NlZFwiOltcImRnY1wiXSxcImFwcGxpY2F0aW9uL3gtZGlyZWN0b3JcIjpbXCJkaXJcIixcImRjclwiLFwiZHhyXCIsXCJjc3RcIixcImNjdFwiLFwiY3h0XCIsXCJ3M2RcIixcImZnZFwiLFwic3dhXCJdLFwiYXBwbGljYXRpb24veC1kb29tXCI6W1wid2FkXCJdLFwiYXBwbGljYXRpb24veC1kdGJuY3greG1sXCI6W1wibmN4XCJdLFwiYXBwbGljYXRpb24veC1kdGJvb2sreG1sXCI6W1wiZHRiXCJdLFwiYXBwbGljYXRpb24veC1kdGJyZXNvdXJjZSt4bWxcIjpbXCJyZXNcIl0sXCJhcHBsaWNhdGlvbi94LWR2aVwiOltcImR2aVwiXSxcImFwcGxpY2F0aW9uL3gtZW52b3lcIjpbXCJldnlcIl0sXCJhcHBsaWNhdGlvbi94LWV2YVwiOltcImV2YVwiXSxcImFwcGxpY2F0aW9uL3gtZm9udC1iZGZcIjpbXCJiZGZcIl0sXCJhcHBsaWNhdGlvbi94LWZvbnQtZ2hvc3RzY3JpcHRcIjpbXCJnc2ZcIl0sXCJhcHBsaWNhdGlvbi94LWZvbnQtbGludXgtcHNmXCI6W1wicHNmXCJdLFwiYXBwbGljYXRpb24veC1mb250LXBjZlwiOltcInBjZlwiXSxcImFwcGxpY2F0aW9uL3gtZm9udC1zbmZcIjpbXCJzbmZcIl0sXCJhcHBsaWNhdGlvbi94LWZvbnQtdHlwZTFcIjpbXCJwZmFcIixcInBmYlwiLFwicGZtXCIsXCJhZm1cIl0sXCJhcHBsaWNhdGlvbi94LWZyZWVhcmNcIjpbXCJhcmNcIl0sXCJhcHBsaWNhdGlvbi94LWZ1dHVyZXNwbGFzaFwiOltcInNwbFwiXSxcImFwcGxpY2F0aW9uL3gtZ2NhLWNvbXByZXNzZWRcIjpbXCJnY2FcIl0sXCJhcHBsaWNhdGlvbi94LWdsdWx4XCI6W1widWx4XCJdLFwiYXBwbGljYXRpb24veC1nbnVtZXJpY1wiOltcImdudW1lcmljXCJdLFwiYXBwbGljYXRpb24veC1ncmFtcHMteG1sXCI6W1wiZ3JhbXBzXCJdLFwiYXBwbGljYXRpb24veC1ndGFyXCI6W1wiZ3RhclwiXSxcImFwcGxpY2F0aW9uL3gtaGRmXCI6W1wiaGRmXCJdLFwiYXBwbGljYXRpb24veC1odHRwZC1waHBcIjpbXCJwaHBcIl0sXCJhcHBsaWNhdGlvbi94LWluc3RhbGwtaW5zdHJ1Y3Rpb25zXCI6W1wiaW5zdGFsbFwiXSxcImFwcGxpY2F0aW9uL3gtaXNvOTY2MC1pbWFnZVwiOltcIippc29cIl0sXCJhcHBsaWNhdGlvbi94LWphdmEtYXJjaGl2ZS1kaWZmXCI6W1wiamFyZGlmZlwiXSxcImFwcGxpY2F0aW9uL3gtamF2YS1qbmxwLWZpbGVcIjpbXCJqbmxwXCJdLFwiYXBwbGljYXRpb24veC1rZWVwYXNzMlwiOltcImtkYnhcIl0sXCJhcHBsaWNhdGlvbi94LWxhdGV4XCI6W1wibGF0ZXhcIl0sXCJhcHBsaWNhdGlvbi94LWx1YS1ieXRlY29kZVwiOltcImx1YWNcIl0sXCJhcHBsaWNhdGlvbi94LWx6aC1jb21wcmVzc2VkXCI6W1wibHpoXCIsXCJsaGFcIl0sXCJhcHBsaWNhdGlvbi94LW1ha2VzZWxmXCI6W1wicnVuXCJdLFwiYXBwbGljYXRpb24veC1taWVcIjpbXCJtaWVcIl0sXCJhcHBsaWNhdGlvbi94LW1vYmlwb2NrZXQtZWJvb2tcIjpbXCJwcmNcIixcIm1vYmlcIl0sXCJhcHBsaWNhdGlvbi94LW1zLWFwcGxpY2F0aW9uXCI6W1wiYXBwbGljYXRpb25cIl0sXCJhcHBsaWNhdGlvbi94LW1zLXNob3J0Y3V0XCI6W1wibG5rXCJdLFwiYXBwbGljYXRpb24veC1tcy13bWRcIjpbXCJ3bWRcIl0sXCJhcHBsaWNhdGlvbi94LW1zLXdtelwiOltcIndtelwiXSxcImFwcGxpY2F0aW9uL3gtbXMteGJhcFwiOltcInhiYXBcIl0sXCJhcHBsaWNhdGlvbi94LW1zYWNjZXNzXCI6W1wibWRiXCJdLFwiYXBwbGljYXRpb24veC1tc2JpbmRlclwiOltcIm9iZFwiXSxcImFwcGxpY2F0aW9uL3gtbXNjYXJkZmlsZVwiOltcImNyZFwiXSxcImFwcGxpY2F0aW9uL3gtbXNjbGlwXCI6W1wiY2xwXCJdLFwiYXBwbGljYXRpb24veC1tc2Rvcy1wcm9ncmFtXCI6W1wiKmV4ZVwiXSxcImFwcGxpY2F0aW9uL3gtbXNkb3dubG9hZFwiOltcIipleGVcIixcIipkbGxcIixcImNvbVwiLFwiYmF0XCIsXCIqbXNpXCJdLFwiYXBwbGljYXRpb24veC1tc21lZGlhdmlld1wiOltcIm12YlwiLFwibTEzXCIsXCJtMTRcIl0sXCJhcHBsaWNhdGlvbi94LW1zbWV0YWZpbGVcIjpbXCIqd21mXCIsXCIqd216XCIsXCIqZW1mXCIsXCJlbXpcIl0sXCJhcHBsaWNhdGlvbi94LW1zbW9uZXlcIjpbXCJtbnlcIl0sXCJhcHBsaWNhdGlvbi94LW1zcHVibGlzaGVyXCI6W1wicHViXCJdLFwiYXBwbGljYXRpb24veC1tc3NjaGVkdWxlXCI6W1wic2NkXCJdLFwiYXBwbGljYXRpb24veC1tc3Rlcm1pbmFsXCI6W1widHJtXCJdLFwiYXBwbGljYXRpb24veC1tc3dyaXRlXCI6W1wid3JpXCJdLFwiYXBwbGljYXRpb24veC1uZXRjZGZcIjpbXCJuY1wiLFwiY2RmXCJdLFwiYXBwbGljYXRpb24veC1ucy1wcm94eS1hdXRvY29uZmlnXCI6W1wicGFjXCJdLFwiYXBwbGljYXRpb24veC1uemJcIjpbXCJuemJcIl0sXCJhcHBsaWNhdGlvbi94LXBlcmxcIjpbXCJwbFwiLFwicG1cIl0sXCJhcHBsaWNhdGlvbi94LXBpbG90XCI6W1wiKnByY1wiLFwiKnBkYlwiXSxcImFwcGxpY2F0aW9uL3gtcGtjczEyXCI6W1wicDEyXCIsXCJwZnhcIl0sXCJhcHBsaWNhdGlvbi94LXBrY3M3LWNlcnRpZmljYXRlc1wiOltcInA3YlwiLFwic3BjXCJdLFwiYXBwbGljYXRpb24veC1wa2NzNy1jZXJ0cmVxcmVzcFwiOltcInA3clwiXSxcImFwcGxpY2F0aW9uL3gtcmFyLWNvbXByZXNzZWRcIjpbXCIqcmFyXCJdLFwiYXBwbGljYXRpb24veC1yZWRoYXQtcGFja2FnZS1tYW5hZ2VyXCI6W1wicnBtXCJdLFwiYXBwbGljYXRpb24veC1yZXNlYXJjaC1pbmZvLXN5c3RlbXNcIjpbXCJyaXNcIl0sXCJhcHBsaWNhdGlvbi94LXNlYVwiOltcInNlYVwiXSxcImFwcGxpY2F0aW9uL3gtc2hcIjpbXCJzaFwiXSxcImFwcGxpY2F0aW9uL3gtc2hhclwiOltcInNoYXJcIl0sXCJhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaFwiOltcInN3ZlwiXSxcImFwcGxpY2F0aW9uL3gtc2lsdmVybGlnaHQtYXBwXCI6W1wieGFwXCJdLFwiYXBwbGljYXRpb24veC1zcWxcIjpbXCJzcWxcIl0sXCJhcHBsaWNhdGlvbi94LXN0dWZmaXRcIjpbXCJzaXRcIl0sXCJhcHBsaWNhdGlvbi94LXN0dWZmaXR4XCI6W1wic2l0eFwiXSxcImFwcGxpY2F0aW9uL3gtc3VicmlwXCI6W1wic3J0XCJdLFwiYXBwbGljYXRpb24veC1zdjRjcGlvXCI6W1wic3Y0Y3Bpb1wiXSxcImFwcGxpY2F0aW9uL3gtc3Y0Y3JjXCI6W1wic3Y0Y3JjXCJdLFwiYXBwbGljYXRpb24veC10M3ZtLWltYWdlXCI6W1widDNcIl0sXCJhcHBsaWNhdGlvbi94LXRhZHNcIjpbXCJnYW1cIl0sXCJhcHBsaWNhdGlvbi94LXRhclwiOltcInRhclwiXSxcImFwcGxpY2F0aW9uL3gtdGNsXCI6W1widGNsXCIsXCJ0a1wiXSxcImFwcGxpY2F0aW9uL3gtdGV4XCI6W1widGV4XCJdLFwiYXBwbGljYXRpb24veC10ZXgtdGZtXCI6W1widGZtXCJdLFwiYXBwbGljYXRpb24veC10ZXhpbmZvXCI6W1widGV4aW5mb1wiLFwidGV4aVwiXSxcImFwcGxpY2F0aW9uL3gtdGdpZlwiOltcIipvYmpcIl0sXCJhcHBsaWNhdGlvbi94LXVzdGFyXCI6W1widXN0YXJcIl0sXCJhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtaGRkXCI6W1wiaGRkXCJdLFwiYXBwbGljYXRpb24veC12aXJ0dWFsYm94LW92YVwiOltcIm92YVwiXSxcImFwcGxpY2F0aW9uL3gtdmlydHVhbGJveC1vdmZcIjpbXCJvdmZcIl0sXCJhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtdmJveFwiOltcInZib3hcIl0sXCJhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtdmJveC1leHRwYWNrXCI6W1widmJveC1leHRwYWNrXCJdLFwiYXBwbGljYXRpb24veC12aXJ0dWFsYm94LXZkaVwiOltcInZkaVwiXSxcImFwcGxpY2F0aW9uL3gtdmlydHVhbGJveC12aGRcIjpbXCJ2aGRcIl0sXCJhcHBsaWNhdGlvbi94LXZpcnR1YWxib3gtdm1ka1wiOltcInZtZGtcIl0sXCJhcHBsaWNhdGlvbi94LXdhaXMtc291cmNlXCI6W1wic3JjXCJdLFwiYXBwbGljYXRpb24veC13ZWItYXBwLW1hbmlmZXN0K2pzb25cIjpbXCJ3ZWJhcHBcIl0sXCJhcHBsaWNhdGlvbi94LXg1MDktY2EtY2VydFwiOltcImRlclwiLFwiY3J0XCIsXCJwZW1cIl0sXCJhcHBsaWNhdGlvbi94LXhmaWdcIjpbXCJmaWdcIl0sXCJhcHBsaWNhdGlvbi94LXhsaWZmK3htbFwiOltcIip4bGZcIl0sXCJhcHBsaWNhdGlvbi94LXhwaW5zdGFsbFwiOltcInhwaVwiXSxcImFwcGxpY2F0aW9uL3gteHpcIjpbXCJ4elwiXSxcImFwcGxpY2F0aW9uL3gtem1hY2hpbmVcIjpbXCJ6MVwiLFwiejJcIixcInozXCIsXCJ6NFwiLFwiejVcIixcIno2XCIsXCJ6N1wiLFwiejhcIl0sXCJhdWRpby92bmQuZGVjZS5hdWRpb1wiOltcInV2YVwiLFwidXZ2YVwiXSxcImF1ZGlvL3ZuZC5kaWdpdGFsLXdpbmRzXCI6W1wiZW9sXCJdLFwiYXVkaW8vdm5kLmRyYVwiOltcImRyYVwiXSxcImF1ZGlvL3ZuZC5kdHNcIjpbXCJkdHNcIl0sXCJhdWRpby92bmQuZHRzLmhkXCI6W1wiZHRzaGRcIl0sXCJhdWRpby92bmQubHVjZW50LnZvaWNlXCI6W1wibHZwXCJdLFwiYXVkaW8vdm5kLm1zLXBsYXlyZWFkeS5tZWRpYS5weWFcIjpbXCJweWFcIl0sXCJhdWRpby92bmQubnVlcmEuZWNlbHA0ODAwXCI6W1wiZWNlbHA0ODAwXCJdLFwiYXVkaW8vdm5kLm51ZXJhLmVjZWxwNzQ3MFwiOltcImVjZWxwNzQ3MFwiXSxcImF1ZGlvL3ZuZC5udWVyYS5lY2VscDk2MDBcIjpbXCJlY2VscDk2MDBcIl0sXCJhdWRpby92bmQucmlwXCI6W1wicmlwXCJdLFwiYXVkaW8veC1hYWNcIjpbXCJhYWNcIl0sXCJhdWRpby94LWFpZmZcIjpbXCJhaWZcIixcImFpZmZcIixcImFpZmNcIl0sXCJhdWRpby94LWNhZlwiOltcImNhZlwiXSxcImF1ZGlvL3gtZmxhY1wiOltcImZsYWNcIl0sXCJhdWRpby94LW00YVwiOltcIiptNGFcIl0sXCJhdWRpby94LW1hdHJvc2thXCI6W1wibWthXCJdLFwiYXVkaW8veC1tcGVndXJsXCI6W1wibTN1XCJdLFwiYXVkaW8veC1tcy13YXhcIjpbXCJ3YXhcIl0sXCJhdWRpby94LW1zLXdtYVwiOltcIndtYVwiXSxcImF1ZGlvL3gtcG4tcmVhbGF1ZGlvXCI6W1wicmFtXCIsXCJyYVwiXSxcImF1ZGlvL3gtcG4tcmVhbGF1ZGlvLXBsdWdpblwiOltcInJtcFwiXSxcImF1ZGlvL3gtcmVhbGF1ZGlvXCI6W1wiKnJhXCJdLFwiYXVkaW8veC13YXZcIjpbXCIqd2F2XCJdLFwiY2hlbWljYWwveC1jZHhcIjpbXCJjZHhcIl0sXCJjaGVtaWNhbC94LWNpZlwiOltcImNpZlwiXSxcImNoZW1pY2FsL3gtY21kZlwiOltcImNtZGZcIl0sXCJjaGVtaWNhbC94LWNtbFwiOltcImNtbFwiXSxcImNoZW1pY2FsL3gtY3NtbFwiOltcImNzbWxcIl0sXCJjaGVtaWNhbC94LXh5elwiOltcInh5elwiXSxcImltYWdlL3Bycy5idGlmXCI6W1wiYnRpZlwiXSxcImltYWdlL3Bycy5wdGlcIjpbXCJwdGlcIl0sXCJpbWFnZS92bmQuYWRvYmUucGhvdG9zaG9wXCI6W1wicHNkXCJdLFwiaW1hZ2Uvdm5kLmFpcnppcC5hY2NlbGVyYXRvci5henZcIjpbXCJhenZcIl0sXCJpbWFnZS92bmQuZGVjZS5ncmFwaGljXCI6W1widXZpXCIsXCJ1dnZpXCIsXCJ1dmdcIixcInV2dmdcIl0sXCJpbWFnZS92bmQuZGp2dVwiOltcImRqdnVcIixcImRqdlwiXSxcImltYWdlL3ZuZC5kdmIuc3VidGl0bGVcIjpbXCIqc3ViXCJdLFwiaW1hZ2Uvdm5kLmR3Z1wiOltcImR3Z1wiXSxcImltYWdlL3ZuZC5keGZcIjpbXCJkeGZcIl0sXCJpbWFnZS92bmQuZmFzdGJpZHNoZWV0XCI6W1wiZmJzXCJdLFwiaW1hZ2Uvdm5kLmZweFwiOltcImZweFwiXSxcImltYWdlL3ZuZC5mc3RcIjpbXCJmc3RcIl0sXCJpbWFnZS92bmQuZnVqaXhlcm94LmVkbWljcy1tbXJcIjpbXCJtbXJcIl0sXCJpbWFnZS92bmQuZnVqaXhlcm94LmVkbWljcy1ybGNcIjpbXCJybGNcIl0sXCJpbWFnZS92bmQubWljcm9zb2Z0Lmljb25cIjpbXCJpY29cIl0sXCJpbWFnZS92bmQubXMtZGRzXCI6W1wiZGRzXCJdLFwiaW1hZ2Uvdm5kLm1zLW1vZGlcIjpbXCJtZGlcIl0sXCJpbWFnZS92bmQubXMtcGhvdG9cIjpbXCJ3ZHBcIl0sXCJpbWFnZS92bmQubmV0LWZweFwiOltcIm5weFwiXSxcImltYWdlL3ZuZC5wY28uYjE2XCI6W1wiYjE2XCJdLFwiaW1hZ2Uvdm5kLnRlbmNlbnQudGFwXCI6W1widGFwXCJdLFwiaW1hZ2Uvdm5kLnZhbHZlLnNvdXJjZS50ZXh0dXJlXCI6W1widnRmXCJdLFwiaW1hZ2Uvdm5kLndhcC53Ym1wXCI6W1wid2JtcFwiXSxcImltYWdlL3ZuZC54aWZmXCI6W1wieGlmXCJdLFwiaW1hZ2Uvdm5kLnpicnVzaC5wY3hcIjpbXCJwY3hcIl0sXCJpbWFnZS94LTNkc1wiOltcIjNkc1wiXSxcImltYWdlL3gtY211LXJhc3RlclwiOltcInJhc1wiXSxcImltYWdlL3gtY214XCI6W1wiY214XCJdLFwiaW1hZ2UveC1mcmVlaGFuZFwiOltcImZoXCIsXCJmaGNcIixcImZoNFwiLFwiZmg1XCIsXCJmaDdcIl0sXCJpbWFnZS94LWljb25cIjpbXCIqaWNvXCJdLFwiaW1hZ2UveC1qbmdcIjpbXCJqbmdcIl0sXCJpbWFnZS94LW1yc2lkLWltYWdlXCI6W1wic2lkXCJdLFwiaW1hZ2UveC1tcy1ibXBcIjpbXCIqYm1wXCJdLFwiaW1hZ2UveC1wY3hcIjpbXCIqcGN4XCJdLFwiaW1hZ2UveC1waWN0XCI6W1wicGljXCIsXCJwY3RcIl0sXCJpbWFnZS94LXBvcnRhYmxlLWFueW1hcFwiOltcInBubVwiXSxcImltYWdlL3gtcG9ydGFibGUtYml0bWFwXCI6W1wicGJtXCJdLFwiaW1hZ2UveC1wb3J0YWJsZS1ncmF5bWFwXCI6W1wicGdtXCJdLFwiaW1hZ2UveC1wb3J0YWJsZS1waXhtYXBcIjpbXCJwcG1cIl0sXCJpbWFnZS94LXJnYlwiOltcInJnYlwiXSxcImltYWdlL3gtdGdhXCI6W1widGdhXCJdLFwiaW1hZ2UveC14Yml0bWFwXCI6W1wieGJtXCJdLFwiaW1hZ2UveC14cGl4bWFwXCI6W1wieHBtXCJdLFwiaW1hZ2UveC14d2luZG93ZHVtcFwiOltcInh3ZFwiXSxcIm1lc3NhZ2Uvdm5kLndmYS53c2NcIjpbXCJ3c2NcIl0sXCJtb2RlbC92bmQuY29sbGFkYSt4bWxcIjpbXCJkYWVcIl0sXCJtb2RlbC92bmQuZHdmXCI6W1wiZHdmXCJdLFwibW9kZWwvdm5kLmdkbFwiOltcImdkbFwiXSxcIm1vZGVsL3ZuZC5ndHdcIjpbXCJndHdcIl0sXCJtb2RlbC92bmQubXRzXCI6W1wibXRzXCJdLFwibW9kZWwvdm5kLm9wZW5nZXhcIjpbXCJvZ2V4XCJdLFwibW9kZWwvdm5kLnBhcmFzb2xpZC50cmFuc21pdC5iaW5hcnlcIjpbXCJ4X2JcIl0sXCJtb2RlbC92bmQucGFyYXNvbGlkLnRyYW5zbWl0LnRleHRcIjpbXCJ4X3RcIl0sXCJtb2RlbC92bmQudXNkeit6aXBcIjpbXCJ1c2R6XCJdLFwibW9kZWwvdm5kLnZhbHZlLnNvdXJjZS5jb21waWxlZC1tYXBcIjpbXCJic3BcIl0sXCJtb2RlbC92bmQudnR1XCI6W1widnR1XCJdLFwidGV4dC9wcnMubGluZXMudGFnXCI6W1wiZHNjXCJdLFwidGV4dC92bmQuY3VybFwiOltcImN1cmxcIl0sXCJ0ZXh0L3ZuZC5jdXJsLmRjdXJsXCI6W1wiZGN1cmxcIl0sXCJ0ZXh0L3ZuZC5jdXJsLm1jdXJsXCI6W1wibWN1cmxcIl0sXCJ0ZXh0L3ZuZC5jdXJsLnNjdXJsXCI6W1wic2N1cmxcIl0sXCJ0ZXh0L3ZuZC5kdmIuc3VidGl0bGVcIjpbXCJzdWJcIl0sXCJ0ZXh0L3ZuZC5mbHlcIjpbXCJmbHlcIl0sXCJ0ZXh0L3ZuZC5mbWkuZmxleHN0b3JcIjpbXCJmbHhcIl0sXCJ0ZXh0L3ZuZC5ncmFwaHZpelwiOltcImd2XCJdLFwidGV4dC92bmQuaW4zZC4zZG1sXCI6W1wiM2RtbFwiXSxcInRleHQvdm5kLmluM2Quc3BvdFwiOltcInNwb3RcIl0sXCJ0ZXh0L3ZuZC5zdW4uajJtZS5hcHAtZGVzY3JpcHRvclwiOltcImphZFwiXSxcInRleHQvdm5kLndhcC53bWxcIjpbXCJ3bWxcIl0sXCJ0ZXh0L3ZuZC53YXAud21sc2NyaXB0XCI6W1wid21sc1wiXSxcInRleHQveC1hc21cIjpbXCJzXCIsXCJhc21cIl0sXCJ0ZXh0L3gtY1wiOltcImNcIixcImNjXCIsXCJjeHhcIixcImNwcFwiLFwiaFwiLFwiaGhcIixcImRpY1wiXSxcInRleHQveC1jb21wb25lbnRcIjpbXCJodGNcIl0sXCJ0ZXh0L3gtZm9ydHJhblwiOltcImZcIixcImZvclwiLFwiZjc3XCIsXCJmOTBcIl0sXCJ0ZXh0L3gtaGFuZGxlYmFycy10ZW1wbGF0ZVwiOltcImhic1wiXSxcInRleHQveC1qYXZhLXNvdXJjZVwiOltcImphdmFcIl0sXCJ0ZXh0L3gtbHVhXCI6W1wibHVhXCJdLFwidGV4dC94LW1hcmtkb3duXCI6W1wibWtkXCJdLFwidGV4dC94LW5mb1wiOltcIm5mb1wiXSxcInRleHQveC1vcG1sXCI6W1wib3BtbFwiXSxcInRleHQveC1vcmdcIjpbXCIqb3JnXCJdLFwidGV4dC94LXBhc2NhbFwiOltcInBcIixcInBhc1wiXSxcInRleHQveC1wcm9jZXNzaW5nXCI6W1wicGRlXCJdLFwidGV4dC94LXNhc3NcIjpbXCJzYXNzXCJdLFwidGV4dC94LXNjc3NcIjpbXCJzY3NzXCJdLFwidGV4dC94LXNldGV4dFwiOltcImV0eFwiXSxcInRleHQveC1zZnZcIjpbXCJzZnZcIl0sXCJ0ZXh0L3gtc3VzZS15bXBcIjpbXCJ5bXBcIl0sXCJ0ZXh0L3gtdXVlbmNvZGVcIjpbXCJ1dVwiXSxcInRleHQveC12Y2FsZW5kYXJcIjpbXCJ2Y3NcIl0sXCJ0ZXh0L3gtdmNhcmRcIjpbXCJ2Y2ZcIl0sXCJ2aWRlby92bmQuZGVjZS5oZFwiOltcInV2aFwiLFwidXZ2aFwiXSxcInZpZGVvL3ZuZC5kZWNlLm1vYmlsZVwiOltcInV2bVwiLFwidXZ2bVwiXSxcInZpZGVvL3ZuZC5kZWNlLnBkXCI6W1widXZwXCIsXCJ1dnZwXCJdLFwidmlkZW8vdm5kLmRlY2Uuc2RcIjpbXCJ1dnNcIixcInV2dnNcIl0sXCJ2aWRlby92bmQuZGVjZS52aWRlb1wiOltcInV2dlwiLFwidXZ2dlwiXSxcInZpZGVvL3ZuZC5kdmIuZmlsZVwiOltcImR2YlwiXSxcInZpZGVvL3ZuZC5mdnRcIjpbXCJmdnRcIl0sXCJ2aWRlby92bmQubXBlZ3VybFwiOltcIm14dVwiLFwibTR1XCJdLFwidmlkZW8vdm5kLm1zLXBsYXlyZWFkeS5tZWRpYS5weXZcIjpbXCJweXZcIl0sXCJ2aWRlby92bmQudXZ2dS5tcDRcIjpbXCJ1dnVcIixcInV2dnVcIl0sXCJ2aWRlby92bmQudml2b1wiOltcInZpdlwiXSxcInZpZGVvL3gtZjR2XCI6W1wiZjR2XCJdLFwidmlkZW8veC1mbGlcIjpbXCJmbGlcIl0sXCJ2aWRlby94LWZsdlwiOltcImZsdlwiXSxcInZpZGVvL3gtbTR2XCI6W1wibTR2XCJdLFwidmlkZW8veC1tYXRyb3NrYVwiOltcIm1rdlwiLFwibWszZFwiLFwibWtzXCJdLFwidmlkZW8veC1tbmdcIjpbXCJtbmdcIl0sXCJ2aWRlby94LW1zLWFzZlwiOltcImFzZlwiLFwiYXN4XCJdLFwidmlkZW8veC1tcy12b2JcIjpbXCJ2b2JcIl0sXCJ2aWRlby94LW1zLXdtXCI6W1wid21cIl0sXCJ2aWRlby94LW1zLXdtdlwiOltcIndtdlwiXSxcInZpZGVvL3gtbXMtd214XCI6W1wid214XCJdLFwidmlkZW8veC1tcy13dnhcIjpbXCJ3dnhcIl0sXCJ2aWRlby94LW1zdmlkZW9cIjpbXCJhdmlcIl0sXCJ2aWRlby94LXNnaS1tb3ZpZVwiOltcIm1vdmllXCJdLFwidmlkZW8veC1zbXZcIjpbXCJzbXZcIl0sXCJ4LWNvbmZlcmVuY2UveC1jb29sdGFsa1wiOltcImljZVwiXX07XG5cbnZhciBtaW1lID0gbmV3IE1pbWVfMShzdGFuZGFyZCwgb3RoZXIpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5mdW5jdGlvbiBnZXRGaWxlTWltZVR5cGUoZmlsZVBhdGgpIHtcbiAgY29uc3QgZXh0ZW5zaW9uID0gZ2V0RmlsZUV4dChmaWxlUGF0aCk7XG4gIGNvbnN0IG1pbWVUeXBlID0gbWltZS5nZXRUeXBlKGV4dGVuc2lvbik7XG4gIHJldHVybiBtaW1lVHlwZTtcbn1cblxuY29uc3QgVU5JWF9TRVAgPSAnLyc7XG5jb25zdCBXSU5fU0VQID0gJ1xcXFwnO1xuZnVuY3Rpb24gZ2V0RmlsZU5hbWUoZmlsZVBhdGgpIHtcbiAgaWYgKCFmaWxlUGF0aCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGxldCBpbmRleFNlcCA9IGZpbGVQYXRoLmxhc3RJbmRleE9mKFVOSVhfU0VQKTtcblxuICBpZiAoaW5kZXhTZXAgPT09IC0xKSB7XG4gICAgaW5kZXhTZXAgPSBmaWxlUGF0aC5sYXN0SW5kZXhPZihXSU5fU0VQKTtcbiAgfVxuXG4gIGlmIChpbmRleFNlcCA9PT0gLTEpIHtcbiAgICByZXR1cm4gZmlsZVBhdGg7XG4gIH1cblxuICByZXR1cm4gZmlsZVBhdGguc2xpY2UoaW5kZXhTZXAgKyAxKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUZpbGUoZml4dHVyZSwgd2luZG93KSB7XG4gIGNvbnN0IHtcbiAgICBmaWxlUGF0aCxcbiAgICBlbmNvZGluZyxcbiAgICBtaW1lVHlwZSxcbiAgICBmaWxlTmFtZSxcbiAgICBsYXN0TW9kaWZpZWRcbiAgfSA9IGZpeHR1cmU7XG4gIGNvbnN0IGZpbGVNaW1lVHlwZSA9IG1pbWVUeXBlIHx8IGdldEZpbGVNaW1lVHlwZShmaWxlUGF0aCk7XG4gIGNvbnN0IGZpbGVFbmNvZGluZyA9IGVuY29kaW5nIHx8IGdldEZpbGVFbmNvZGluZyhmaWxlUGF0aCk7XG4gIGNvbnN0IGZpbGVMYXN0TW9kaWZpZWQgPSBsYXN0TW9kaWZpZWQgfHwgRGF0ZS5ub3coKTtcbiAgcmV0dXJuIG5ldyBDeXByZXNzLlByb21pc2UocmVzb2x2ZSA9PiBnZXRGaWxlQ29udGVudCh7XG4gICAgZmlsZVBhdGgsXG4gICAgZmlsZUNvbnRlbnQ6IGZpeHR1cmUuZmlsZUNvbnRlbnQsXG4gICAgZmlsZUVuY29kaW5nXG4gIH0pLnRoZW4oZmlsZUNvbnRlbnQgPT4gZ2V0RmlsZUJsb2JBc3luYyh7XG4gICAgZmlsZUNvbnRlbnQsXG4gICAgZmlsZU5hbWUsXG4gICAgbWltZVR5cGU6IGZpbGVNaW1lVHlwZSxcbiAgICBlbmNvZGluZzogZmlsZUVuY29kaW5nLFxuICAgIGxhc3RNb2RpZmllZDogZmlsZUxhc3RNb2RpZmllZCxcbiAgICB3aW5kb3dcbiAgfSkpLnRoZW4ocmVzb2x2ZSkpO1xufVxuXG5mdW5jdGlvbiBnZXRGaXh0dXJlSW5mbyhmaXh0dXJlSW5wdXQpIHtcbiAgaWYgKHR5cGVvZiBmaXh0dXJlSW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGVQYXRoOiBmaXh0dXJlSW5wdXQsXG4gICAgICBlbmNvZGluZzogJycsXG4gICAgICBtaW1lVHlwZTogJycsXG4gICAgICBmaWxlTmFtZTogZ2V0RmlsZU5hbWUoZml4dHVyZUlucHV0KVxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZpbGVQYXRoOiBmaXh0dXJlSW5wdXQuZmlsZVBhdGgsXG4gICAgZW5jb2Rpbmc6IGZpeHR1cmVJbnB1dC5lbmNvZGluZyB8fCAnJyxcbiAgICBtaW1lVHlwZTogZml4dHVyZUlucHV0Lm1pbWVUeXBlIHx8ICcnLFxuICAgIGZpbGVOYW1lOiBmaXh0dXJlSW5wdXQuZmlsZU5hbWUgfHwgZ2V0RmlsZU5hbWUoZml4dHVyZUlucHV0LmZpbGVQYXRoKSxcbiAgICBmaWxlQ29udGVudDogZml4dHVyZUlucHV0LmZpbGVDb250ZW50LFxuICAgIGxhc3RNb2RpZmllZDogZml4dHVyZUlucHV0Lmxhc3RNb2RpZmllZFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRGb3JjZVZhbHVlKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzTWFudWFsRXZlbnRIYW5kbGluZygpIHx8ICFpc0VsZW1lbnRWaXNpYmxlKHN1YmplY3QpIHx8IGlzU2hhZG93RWxlbWVudChzdWJqZWN0KTtcbn1cblxuY29uc3QgRVJSX1RZUEVTID0ge1xuICBJTlZBTElEX1NVQkpFQ1RfVFlQRToge1xuICAgIG1lc3NhZ2U6ICdcInN1YmplY3RUeXBlXCIgaXMgbm90IHZhbGlkJyxcbiAgICB0aXA6ICdQbGVhc2UgbG9vayBpbnRvIGRvY3MgdG8gZmluZCBzdXBwb3J0ZWQgXCJzdWJqZWN0VHlwZVwiIHZhbHVlcydcbiAgfSxcbiAgSU5WQUxJRF9GT1JDRToge1xuICAgIG1lc3NhZ2U6ICdcImZvcmNlXCIgaXMgbm90IHZhbGlkJyxcbiAgICB0aXA6ICdQbGVhc2UgbG9vayBpbnRvIGRvY3MgdG8gZmluZCBzdXBwb3J0ZWQgXCJmb3JjZVwiIHZhbHVlcydcbiAgfSxcbiAgSU5WQUxJRF9BTExPV19FTVBUWToge1xuICAgIG1lc3NhZ2U6ICdcImFsbG93RW1wdHlcIiBpcyBub3QgdmFsaWQnLFxuICAgIHRpcDogJ1BsZWFzZSBsb29rIGludG8gZG9jcyB0byBmaW5kIHN1cHBvcnRlZCBcImFsbG93RW1wdHlcIiB2YWx1ZXMnXG4gIH0sXG4gIElOVkFMSURfRklMRV9FTkNPRElORzoge1xuICAgIG1lc3NhZ2U6ICdcImZpbGUgZW5jb2RpbmdcIiBpcyBub3QgdmFsaWQnLFxuICAgIHRpcDogJ1BsZWFzZSBsb29rIGludG8gZG9jcyB0byBmaW5kIHN1cHBvcnRlZCBcImVuY29kaW5nXCIgdmFsdWVzJ1xuICB9LFxuICBJTlZBTElEX0ZJTEVfUEFUSDoge1xuICAgIG1lc3NhZ2U6ICdcImZpbGVQYXRoXCIgaXMgbm90IHZhbGlkJyxcbiAgICB0aXA6ICdQbGVhc2UgbG9vayBpbnRvIGRvY3MgdG8gZmluZCBzdXBwb3J0ZWQgXCJmaWxlUGF0aFwiIHZhbHVlcydcbiAgfSxcbiAgSU5WQUxJRF9NSU1FX1RZUEU6IHtcbiAgICBtZXNzYWdlOiAnXCJtaW1lVHlwZVwiIGlzIG5vdCB2YWxpZCcsXG4gICAgdGlwOiAnUGxlYXNlIGxvb2sgaW50byBkb2NzIHRvIGZpbmQgc3VwcG9ydGVkIFwibWltZVR5cGVcIiB2YWx1ZXMnXG4gIH0sXG4gIElOVkFMSURfRklMRToge1xuICAgIG1lc3NhZ2U6ICdnaXZlbiBmaXh0dXJlIGZpbGUgaXMgZW1wdHknLFxuICAgIHRpcDogJ1BsZWFzZSBtYWtlIHN1cmUgeW91IHByb3ZpZGUgY29ycmVjdCBmaWxlIG9yIGV4cGxpY2l0bHkgc2V0IFwiYWxsb3dFbXB0eVwiIHRvIHRydWUnXG4gIH0sXG4gIElOVkFMSURfTEFTVF9NT0RJRklFRDoge1xuICAgIG1lc3NhZ2U6ICdcImxhc3RNb2RpZmllZFwiIGlzIG5vdCB2YWxpZFwiJyxcbiAgICB0aXA6ICdQbGVhc2UgbWFrZSBzdXJlIHlvdSBhcmUgcGFzc2luZyBhIFwibnVtYmVyXCIgYERhdGUubm93KClgIG9yIGBuZXcgRGF0ZSgpLmdldFRpbWUoKSdcbiAgfSxcbiAgTUlTU0lOR19GSUxFX05BTUVfT1JfUEFUSDoge1xuICAgIG1lc3NhZ2U6ICdtaXNzaW5nIFwiZmlsZVBhdGhcIiBvciBcImZpbGVOYW1lXCInLFxuICAgIHRpcDogJ1BsZWFzZSBtYWtlIHN1cmUgeW91IGFyZSBwYXNzaW5nIGVpdGhlciBcImZpbGVQYXRoXCIgb3IgXCJmaWxlTmFtZVwiJ1xuICB9XG59O1xuY2xhc3MgSW50ZXJuYWxFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZXJyb3JUeXBlLCAuLi5wYXJhbXMpIHtcbiAgICBzdXBlciguLi5wYXJhbXMpO1xuXG4gICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBJbnRlcm5hbEVycm9yKTtcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSAnW2N5cHJlc3MtZmlsZS11cGxvYWQgZXJyb3JdJztcbiAgICB0aGlzLm1lc3NhZ2UgPSBgJHtlcnJvclR5cGUubWVzc2FnZX0uXFxuJHtlcnJvclR5cGUudGlwfWA7XG4gIH1cblxufVxuXG5jb25zdCBBTExPV0VEX0VOQ09ESU5HUyA9IE9iamVjdC52YWx1ZXMoRU5DT0RJTkcpO1xuZnVuY3Rpb24gdmFsaWRhdGVGaXh0dXJlcyhmaXh0dXJlKSB7XG4gIGNvbnN0IHtcbiAgICBmaWxlUGF0aCxcbiAgICBmaWxlTmFtZSxcbiAgICBlbmNvZGluZyxcbiAgICBtaW1lVHlwZSxcbiAgICBmaWxlQ29udGVudCxcbiAgICBsYXN0TW9kaWZpZWRcbiAgfSA9IGZpeHR1cmU7XG5cbiAgaWYgKGVuY29kaW5nICYmICFBTExPV0VEX0VOQ09ESU5HUy5pbmNsdWRlcyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgSW50ZXJuYWxFcnJvcihFUlJfVFlQRVMuSU5WQUxJRF9GSUxFX0VOQ09ESU5HKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZmlsZVBhdGggIT09ICdzdHJpbmcnICYmICFmaWxlQ29udGVudCkge1xuICAgIHRocm93IG5ldyBJbnRlcm5hbEVycm9yKEVSUl9UWVBFUy5JTlZBTElEX0ZJTEVfUEFUSCk7XG4gIH1cblxuICBpZiAodHlwZW9mIG1pbWVUeXBlICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBJbnRlcm5hbEVycm9yKEVSUl9UWVBFUy5JTlZBTElEX01JTUVfVFlQRSk7XG4gIH1cblxuICBpZiAoIWZpbGVQYXRoICYmICFmaWxlTmFtZSkge1xuICAgIHRocm93IG5ldyBJbnRlcm5hbEVycm9yKEVSUl9UWVBFUy5NSVNTSU5HX0ZJTEVfTkFNRV9PUl9QQVRIKTtcbiAgfVxuXG4gIGlmIChsYXN0TW9kaWZpZWQgJiYgdHlwZW9mIGxhc3RNb2RpZmllZCAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgSW50ZXJuYWxFcnJvcihFUlJfVFlQRVMuSU5WQUxJRF9MQVNUX01PRElGSUVEKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG52YXIgdmFsaWRhdGVGaWxlID0gKChmaWxlLCBhbGxvd0VtcHR5KSA9PiB7XG4gIGlmICghYWxsb3dFbXB0eSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHNpemVcbiAgICB9ID0gZmlsZTtcblxuICAgIGlmIChzaXplID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgSW50ZXJuYWxFcnJvcihFUlJfVFlQRVMuSU5WQUxJRF9GSUxFKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG52YXIgdmFsaWRhdGVPcHRpb25zID0gKCh7XG4gIHN1YmplY3RUeXBlLFxuICBmb3JjZSxcbiAgYWxsb3dFbXB0eVxufSkgPT4ge1xuICBpZiAoT2JqZWN0LnZhbHVlcyhTVUJKRUNUX1RZUEUpLmluZGV4T2Yoc3ViamVjdFR5cGUpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBJbnRlcm5hbEVycm9yKEVSUl9UWVBFUy5JTlZBTElEX1NVQkpFQ1RfVFlQRSk7XG4gIH1cblxuICBpZiAodHlwZW9mIGZvcmNlICE9PSAnYm9vbGVhbicpIHtcbiAgICB0aHJvdyBuZXcgSW50ZXJuYWxFcnJvcihFUlJfVFlQRVMuSU5WQUxJRF9GT1JDRSk7XG4gIH1cblxuICBpZiAodHlwZW9mIGFsbG93RW1wdHkgIT09ICdib29sZWFuJykge1xuICAgIHRocm93IG5ldyBJbnRlcm5hbEVycm9yKEVSUl9UWVBFUy5JTlZBTElEX0FMTE9XX0VNUFRZKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufSk7XG5cbmZ1bmN0aW9uIF9leHRlbmRzKCkge1xuICBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlKHRhcmdldCA9IHt9LCBzb3VyY2UgPSB7fSkge1xuICByZXR1cm4gX2V4dGVuZHMoe30sIHNvdXJjZSwgdGFyZ2V0KTtcbn1cblxuZnVuY3Rpb24gYXR0YWNoRmlsZShzdWJqZWN0LCBmaXh0dXJlT3JGaXh0dXJlQXJyYXksIHByb2Nlc3NpbmdPcHRpb25zKSB7XG4gIGNvbnN0IHtcbiAgICBzdWJqZWN0VHlwZSxcbiAgICBmb3JjZSxcbiAgICBhbGxvd0VtcHR5XG4gIH0gPSBtZXJnZShwcm9jZXNzaW5nT3B0aW9ucywgREVGQVVMVF9QUk9DRVNTSU5HX09QVElPTlMpO1xuICB2YWxpZGF0ZU9wdGlvbnMoe1xuICAgIHN1YmplY3RUeXBlLFxuICAgIGZvcmNlLFxuICAgIGFsbG93RW1wdHlcbiAgfSk7XG4gIGNvbnN0IGZpeHR1cmVzQXJyYXkgPSBBcnJheS5pc0FycmF5KGZpeHR1cmVPckZpeHR1cmVBcnJheSkgPyBmaXh0dXJlT3JGaXh0dXJlQXJyYXkgOiBbZml4dHVyZU9yRml4dHVyZUFycmF5XTtcbiAgY29uc3QgZml4dHVyZXMgPSBmaXh0dXJlc0FycmF5Lm1hcChnZXRGaXh0dXJlSW5mbykuZmlsdGVyKHZhbGlkYXRlRml4dHVyZXMpO1xuICBDeXByZXNzLmN5LndpbmRvdyh7XG4gICAgbG9nOiBmYWxzZVxuICB9KS50aGVuKHdpbmRvdyA9PiB7XG4gICAgY29uc3QgZm9yY2VWYWx1ZSA9IGZvcmNlIHx8IGdldEZvcmNlVmFsdWUoc3ViamVjdCk7XG4gICAgQ3lwcmVzcy5Qcm9taXNlLmFsbChmaXh0dXJlcy5tYXAoZiA9PiByZXNvbHZlRmlsZShmLCB3aW5kb3cpKSkgLy8gcmVzb2x2ZSBmaWxlc1xuICAgIC50aGVuKGZpbGVzID0+IGZpbGVzLmZpbHRlcihmID0+IHZhbGlkYXRlRmlsZShmLCBhbGxvd0VtcHR5KSkpIC8vIGVycm9yIGlmIGFueSBvZiB0aGUgZmlsZSBjb250ZW50cyBhcmUgaW52YWxpZFxuICAgIC50aGVuKGZpbGVzID0+IHtcbiAgICAgIGF0dGFjaEZpbGVUb0VsZW1lbnQoc3ViamVjdCwge1xuICAgICAgICBmaWxlcyxcbiAgICAgICAgc3ViamVjdFR5cGUsXG4gICAgICAgIGZvcmNlOiBmb3JjZVZhbHVlLFxuICAgICAgICB3aW5kb3dcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZpbGVzO1xuICAgIH0pLnRoZW4oZmlsZXMgPT4gQ3lwcmVzcy5sb2coe1xuICAgICAgbmFtZTogJ2F0dGFjaEZpbGUnLFxuICAgICAgZGlzcGxheU5hbWU6ICdGSUxFJyxcbiAgICAgIG1lc3NhZ2U6IGZpbGVzLnJlZHVjZSgoYWNjLCBmKSA9PiBgJHthY2MubGVuZ3RoID4gMCA/IGAke2FjY30sIGAgOiBhY2N9JHtmLm5hbWV9YCwgJycpXG4gICAgfSkpO1xuICB9KTtcbiAgcmV0dXJuIEN5cHJlc3MuY3kud3JhcChzdWJqZWN0LCB7XG4gICAgbG9nOiBmYWxzZVxuICB9KTtcbn1cblxuY29uc3QgaW5pdGlhbGl6ZSA9ICgpID0+IHtcbiAgQ3lwcmVzcy5Db21tYW5kcy5hZGQoJ2F0dGFjaEZpbGUnLCB7XG4gICAgcHJldlN1YmplY3Q6IHRydWVcbiAgfSwgYXR0YWNoRmlsZSk7XG59O1xuXG5pbml0aWFsaXplKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idW5kbGUuanMubWFwXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IFwiY3lwcmVzcy1maWxlLXVwbG9hZFwiO1xyXG5cclxuYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgY3kudmlzaXQoXCJjeXByZXNzL2ZpeHR1cmVzL3JlZ2lzdHJhdGlvbl9mb3JtXzMuaHRtbFwiKTtcclxufSk7XHJcblxyXG4vKlxyXG5CT05VUyBUQVNLOiBhZGQgdmlzdWFsIHRlc3RzIGZvciByZWdpc3RyYXRpb24gZm9ybSAzXHJcblRhc2sgbGlzdDpcclxuKiBDcmVhdGUgdGVzdCBzdWl0ZSBmb3IgdmlzdWFsIHRlc3RzIGZvciByZWdpc3RyYXRpb24gZm9ybSAzIChkZXNjcmliZSBibG9jaylcclxuKiBDcmVhdGUgdGVzdHMgdG8gdmVyaWZ5IHZpc3VhbCBwYXJ0cyBvZiB0aGUgcGFnZTpcclxuICAgICogcmFkaW8gYnV0dG9ucyBhbmQgaXRzIGNvbnRlbnRcclxuICAgICogZHJvcGRvd24gYW5kIGRlcGVuZGVuY2llcyBiZXR3ZWVuIDIgZHJvcGRvd25zOlxyXG4gICAgICAgICogbGlzdCBvZiBjaXRpZXMgY2hhbmdlcyBkZXBlbmRpbmcgb24gdGhlIGNob2ljZSBvZiBjb3VudHJ5XHJcbiAgICAgICAgKiBpZiBjaXR5IGlzIGFscmVhZHkgY2hvc2VuIGFuZCBjb3VudHJ5IGlzIHVwZGF0ZWQsIHRoZW4gY2l0eSBjaG9pY2Ugc2hvdWxkIGJlIHJlbW92ZWRcclxuICAgICogY2hlY2tib3hlcywgdGhlaXIgY29udGVudCBhbmQgbGlua3NcclxuICAgICogZW1haWwgZm9ybWF0XHJcbiAqL1xyXG5cclxuZGVzY3JpYmUoXCJCb251cyBzZWN0aW9uOiBWaXN1YWwgdGVzdHMsIGNyZWF0ZWQgYnk6IEthZGktS3Jpc3RlbFwiLCAoKSA9PiB7XHJcbiAgaXQoXCJDaGVjayB0aGF0IENvdW50cnkgZHJvcGRvd24gaXMgY29ycmVjdCBhbmQgQ2l0eSBkcm9wZG93biB1cGRhdGVzIGFjY29yZGluZ2x5XCIsICgpID0+IHtcclxuICAgIGN5LmdldChcIiNjb3VudHJ5XCIpLmNoaWxkcmVuKCkuc2hvdWxkKFwiaGF2ZS5sZW5ndGhcIiwgNCk7XHJcbiAgICBjeS5nZXQoXCIjY291bnRyeVwiKS5maW5kKFwib3B0aW9uXCIpLnNob3VsZChcImhhdmUubGVuZ3RoXCIsIDQpO1xyXG5cclxuICAgIC8vIFNlbGVjdCBhIGNvdW50cnkgKEVzdG9uaWEpXHJcbiAgICBjeS5nZXQoXCIjY291bnRyeVwiKS5zZWxlY3QoXCJFc3RvbmlhXCIpLnNob3VsZChcImhhdmUudmFsdWVcIiwgXCJvYmplY3Q6NFwiKTtcclxuXHJcbiAgICBjeS5nZXQoXCIjY2l0eVwiKS5zZWxlY3QoXCJIYWFwc2FsdVwiKTtcclxuICAgIGN5LmdldChcIiNjaXR5XCIpLnNob3VsZChcImNvbnRhaW5cIiwgXCJIYWFwc2FsdVwiKTtcclxuXHJcbiAgICAvLyBDaGFuZ2UgYSBjb3VudHJ5IHRvIFNwYWluXHJcbiAgICBjeS5nZXQoXCIjY291bnRyeVwiKS5zZWxlY3QoXCJTcGFpblwiKS5zaG91bGQoXCJoYXZlLnZhbHVlXCIsIFwib2JqZWN0OjNcIik7XHJcblxyXG4gICAgLy8gVmVyaWZ5IHRoYXQgY2l0eSBcIkhhYXBzYWx1XCIgaXMgcmVtb3ZlZFxyXG4gICAgY3kuZ2V0KFwiI2NpdHlcIikuZmluZChcIm9wdGlvblwiKS5zaG91bGQoXCJub3QuY29udGFpblwiLCBcIkhhYXBzYWx1XCIpO1xyXG5cclxuICAgIGNvbnN0IGV4cGVjdGVkQ2l0eU9wdGlvbnMgPSBbXHJcbiAgICAgIFwiXCIsXHJcbiAgICAgIFwiTWFsYWdhXCIsXHJcbiAgICAgIFwiTWFkcmlkXCIsXHJcbiAgICAgIFwiVmFsZW5jaWFcIixcclxuICAgICAgXCJDb3JyYWxlam9cIixcclxuICAgIF07XHJcblxyXG4gICAgY3kuZ2V0KFwiI2NpdHlcIilcclxuICAgICAgLmZpbmQoXCJvcHRpb25cIilcclxuICAgICAgLnRoZW4oKCRvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWN0dWFsQ2l0eU9wdGlvbnMgPSBbLi4uJG9wdGlvbnNdLm1hcCgob3B0aW9uKSA9PiBvcHRpb24udGV4dCk7XHJcbiAgICAgICAgZXhwZWN0KGFjdHVhbENpdHlPcHRpb25zKS50by5kZWVwLmVxKGV4cGVjdGVkQ2l0eU9wdGlvbnMpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICBjeS5nZXQoXCIjY2l0eVwiKS5zZWxlY3QoXCJWYWxlbmNpYVwiKTtcclxuICAgIGN5LmdldChcIiNjaXR5XCIpLnNob3VsZChcImNvbnRhaW5cIiwgXCJWYWxlbmNpYVwiKTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJDaGVjayB0aGF0IHJhZGlvIGJ1dHRvbiBsaXN0IGlzIGNvcnJlY3RcIiwgKCkgPT4ge1xyXG4gICAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS5zaG91bGQoXCJoYXZlLmxlbmd0aFwiLCA0KTtcclxuXHJcbiAgICBjeS5nZXQoXCJpbnB1dFt0eXBlPXJhZGlvXVwiKS5uZXh0KCkuZXEoMCkuc2hvdWxkKFwiaGF2ZS50ZXh0XCIsIFwiRGFpbHlcIik7XHJcbiAgICBjeS5nZXQoXCJpbnB1dFt0eXBlPXJhZGlvXVwiKS5uZXh0KCkuZXEoMSkuc2hvdWxkKFwiaGF2ZS50ZXh0XCIsIFwiV2Vla2x5XCIpO1xyXG4gICAgY3kuZ2V0KFwiaW5wdXRbdHlwZT1yYWRpb11cIikubmV4dCgpLmVxKDIpLnNob3VsZChcImhhdmUudGV4dFwiLCBcIk1vbnRobHlcIik7XHJcbiAgICBjeS5nZXQoXCJpbnB1dFt0eXBlPXJhZGlvXVwiKS5uZXh0KCkuZXEoMykuc2hvdWxkKFwiaGF2ZS50ZXh0XCIsIFwiTmV2ZXJcIik7XHJcblxyXG4gICAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS5lcSgwKS5zaG91bGQoXCJub3QuYmUuY2hlY2tlZFwiKTtcclxuICAgIGN5LmdldCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJykuZXEoMSkuc2hvdWxkKFwibm90LmJlLmNoZWNrZWRcIik7XHJcbiAgICBjeS5nZXQoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpLmVxKDIpLnNob3VsZChcIm5vdC5iZS5jaGVja2VkXCIpO1xyXG4gICAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS5lcSgzKS5zaG91bGQoXCJub3QuYmUuY2hlY2tlZFwiKTtcclxuXHJcbiAgICBjeS5nZXQoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpLmVxKDEpLmNoZWNrKCkuc2hvdWxkKFwiYmUuY2hlY2tlZFwiKTtcclxuICAgIGN5LmdldCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJykuZXEoMykuY2hlY2soKS5zaG91bGQoXCJiZS5jaGVja2VkXCIpO1xyXG4gICAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS5lcSgxKS5zaG91bGQoXCJub3QuYmUuY2hlY2tlZFwiKTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJDaGVjayB0aGF0IGNoZWNrYm94IGxpc3QgaXMgY29ycmVjdFwiLCAoKSA9PiB7XHJcbiAgICBjeS5nZXQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLnNob3VsZChcImhhdmUubGVuZ3RoXCIsIDIpO1xyXG5cclxuICAgIGN5LmdldCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykubmV4dCgpLmVxKDApLnNob3VsZChcImhhdmUudGV4dFwiLCBcIlwiKTtcclxuICAgIGN5LmdldCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJylcclxuICAgICAgLm5leHQoKVxyXG4gICAgICAuZXEoMSlcclxuICAgICAgLnNob3VsZChcImhhdmUudGV4dFwiLCBcIkFjY2VwdCBvdXIgY29va2llIHBvbGljeVwiKTtcclxuXHJcbiAgICBjeS5nZXQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmVxKDApLnNob3VsZChcIm5vdC5iZS5jaGVja2VkXCIpO1xyXG4gICAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5lcSgxKS5zaG91bGQoXCJub3QuYmUuY2hlY2tlZFwiKTtcclxuXHJcbiAgICBjeS5nZXQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmVxKDApLmNoZWNrKCkuc2hvdWxkKFwiYmUuY2hlY2tlZFwiKTtcclxuICAgIGN5LmdldCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuZXEoMSkuY2hlY2soKS5zaG91bGQoXCJiZS5jaGVja2VkXCIpO1xyXG5cclxuICAgIGN5LmdldCgnYnV0dG9uIGFbaHJlZj1cImNvb2tpZVBvbGljeS5odG1sXCJdJykuY2xpY2soKTtcclxuICAgIGN5LnVybCgpLnNob3VsZChcImluY2x1ZGVcIiwgXCJjb29raWVQb2xpY3kuaHRtbFwiKTtcclxuICAgIGN5LmdvKFwiYmFja1wiKTtcclxuICAgIGN5LnVybCgpLnNob3VsZChcIm5vdC5pbmNsdWRlXCIsIFwiY29va2llUG9saWN5Lmh0bWxcIik7XHJcblxyXG4gICAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5lcSgwKS5zaG91bGQoXCJiZS5jaGVja2VkXCIpO1xyXG4gICAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5lcSgxKS5zaG91bGQoXCJiZS5jaGVja2VkXCIpO1xyXG4gIH0pO1xyXG5cclxuICBpdChcIkNoZWNrIHRoYXQgZW1haWwgZm9ybWF0IGlzIGNvcnJlY3RcIiwgKCkgPT4ge1xyXG4gICAgY3kuZ2V0KCdpbnB1dFtuYW1lPVwiZW1haWxcIl0nKS50eXBlKFwia2FkaS50ZXN0LmNvbVwiKTtcclxuICAgIGN5LmdldCgnI2VtYWlsQWxlcnQgc3BhbltuZy1zaG93PVwibXlGb3JtLmVtYWlsLiRlcnJvci5lbWFpbFwiXScpXHJcbiAgICAgIC5zaG91bGQoXCJiZS52aXNpYmxlXCIpXHJcbiAgICAgIC5hbmQoXCJjb250YWluXCIsIFwiSW52YWxpZCBlbWFpbCBhZGRyZXNzXCIpO1xyXG4gICAgY3kuZ2V0KCdpbnB1dFtuYW1lPVwiZW1haWxcIl0nKS5jbGVhcigpO1xyXG4gICAgY3kuZ2V0KCdpbnB1dFtuYW1lPVwiZW1haWxcIl0nKS50eXBlKFwia2FkaUB0ZXN0LmNvbVwiKTtcclxuICAgIGN5LmdldCgnI2VtYWlsQWxlcnQgc3BhbltuZy1zaG93PVwibXlGb3JtLmVtYWlsLiRlcnJvci5lbWFpbFwiXScpLnNob3VsZChcclxuICAgICAgXCJub3QuYmUudmlzaWJsZVwiXHJcbiAgICApO1xyXG4gIH0pO1xyXG5cclxuICBpdChcIkNoZWNrIHRoYXQgZGF0ZXBpY2tlciB3b3JrcyBmb3IgZGF0ZSBvZiByZWdpc3RyYXRpb25cIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgZGF0ZSA9IHRvZGF5LnRvSVNPU3RyaW5nKCkuc3BsaXQoXCJUXCIpWzBdO1xyXG4gICAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwiZGF0ZVwiXScpLmZpcnN0KCkudHlwZShkYXRlKTtcclxuICAgIGN5LmdldCgnaW5wdXRbdHlwZT1cImRhdGVcIl0nKS5zaG91bGQoXCJoYXZlLnZhbHVlXCIsIGRhdGUpO1xyXG4gIH0pO1xyXG59KTtcclxuLypcclxuQk9OVVMgVEFTSzogYWRkIGZ1bmN0aW9uYWwgdGVzdHMgZm9yIHJlZ2lzdHJhdGlvbiBmb3JtIDNcclxuVGFzayBsaXN0OlxyXG4qIENyZWF0ZSBzZWNvbmQgdGVzdCBzdWl0ZSBmb3IgZnVuY3Rpb25hbCB0ZXN0c1xyXG4qIENyZWF0ZSB0ZXN0cyB0byB2ZXJpZnkgbG9naWMgb2YgdGhlIHBhZ2U6XHJcbiAgICAqIGFsbCBmaWVsZHMgYXJlIGZpbGxlZCBpbiArIGNvcnJlc3BvbmRpbmcgYXNzZXJ0aW9uc1xyXG4gICAgKiBvbmx5IG1hbmRhdG9yeSBmaWVsZHMgYXJlIGZpbGxlZCBpbiArIGNvcnJlc3BvbmRpbmcgYXNzZXJ0aW9uc1xyXG4gICAgKiBtYW5kYXRvcnkgZmllbGRzIGFyZSBhYnNlbnQgKyBjb3JyZXNwb25kaW5nIGFzc2VydGlvbnMgKHRyeSB1c2luZyBmdW5jdGlvbilcclxuICAgICogYWRkIGZpbGUgZnVuY3Rpb25saXR5KGdvb2dsZSB5b3Vyc2VsZiBmb3Igc29sdXRpb24hKVxyXG4gKi9cclxuXHJcbmRlc2NyaWJlKFwiQm9udXMgc2VjdGlvbjogRnVuY3Rpb25hbCB0ZXN0cywgY3JlYXRlZCBieTogS2FkaS1LcmlzdGVsXCIsICgpID0+IHtcclxuICBpdChcIlVzZXIgY2FuIHN1Ym1pdCBmb3JtIHdpdGggYWxsIGZpZWxkcyB2YWxpZFwiLCAoKSA9PiB7XHJcbiAgICBjeS5nZXQoXCIjbmFtZVwiKS50eXBlKFwiS2FkaVwiKTtcclxuICAgIGN5LmdldCgnaW5wdXRbbmFtZT1cImVtYWlsXCJdJykudHlwZShcImthZGlAdGVzdC5jb21cIik7XHJcbiAgICBjeS5nZXQoJyNlbWFpbEFsZXJ0IHNwYW5bbmctc2hvdz1cIm15Rm9ybS5lbWFpbC4kZXJyb3IuZW1haWxcIl0nKS5zaG91bGQoXHJcbiAgICAgIFwibm90LmJlLnZpc2libGVcIlxyXG4gICAgKTtcclxuICAgIGN5LmdldChcIiNlbWFpbEFsZXJ0XCIpLnNob3VsZChcIm5vdC5iZS52aXNpYmxlXCIpO1xyXG4gICAgY3kuZ2V0KFwiI2NvdW50cnlcIikuc2VsZWN0KFwib2JqZWN0OjVcIikuc2hvdWxkKFwiY29udGFpblwiLCBcIkF1c3RyaWFcIik7XHJcblxyXG4gICAgLy8gQWZ0ZXIgc3VibWl0dGluZyB0aGUgZm9ybSwgY2l0eSBkcm9wZG93biBzZWVtcyB0byBiZSBicm9rZW4uIEl0IGRvZXNuJ3QgZGlzcGxheSBTYWx6YnVyZyBhbnltb3JlIChhbGwgdGhlIG90aGVyIGZpZWxkcyBhcmUgc3RpbGwgZmlsbGVkKVxyXG4gICAgY3kuZ2V0KFwiI2NpdHlcIikuc2VsZWN0KFwiU2FsemJ1cmdcIikuc2hvdWxkKFwiY29udGFpblwiLCBcIlNhbHpidXJnXCIpO1xyXG5cclxuICAgIGN5LmdldCgnaW5wdXRbdHlwZT1cImRhdGVcIl0nKS5maXJzdCgpLnR5cGUoXCIyMDI0LTA3LTEyXCIpO1xyXG4gICAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS5jaGVjayhcIk1vbnRobHlcIik7XHJcbiAgICBjeS5nZXQoXCIjYmlydGhkYXlcIikudHlwZShcIjE5OTUtMDMtMjlcIik7XHJcbiAgICBjeS5nZXQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmVxKDEpLmNoZWNrKCk7XHJcbiAgICBjeS5nZXQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmVxKDEpLnNob3VsZChcImJlLmNoZWNrZWRcIik7XHJcbiAgICBjeS5nZXQoXCIjY2hlY2tib3hBbGVydFwiKS5zaG91bGQoXCJub3QuYmUudmlzaWJsZVwiKTtcclxuXHJcbiAgICAvLyBVcGxvYWRpbmcgYSBmaWxlXHJcbiAgICBjb25zdCBmaWxlTmFtZSA9IFwiZXhhbXBsZV9maWxlX2Zvcm0zXCI7XHJcbiAgICBjeS5nZXQoXCIjbXlGaWxlXCIpLmF0dGFjaEZpbGUoZmlsZU5hbWUpO1xyXG5cclxuICAgIGN5LmdldCgnYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0nKS5jbGljaygpO1xyXG4gICAgY3kuZ28oXCJiYWNrXCIpO1xyXG4gICAgY3kubG9nKFwiQmFjayBhZ2FpbiBpbiBSZWdpc3RyYXRpb24gZm9ybSAzXCIpO1xyXG4gIH0pO1xyXG5cclxuICBpdChcIlVzZXIgZmlsbHMgb25seSBtYW5kYXRvcnkgZmllbGRzXCIsICgpID0+IHtcclxuICAgIGN5LmdldChcIiNuYW1lXCIpLnR5cGUoXCJLYWRpXCIpO1xyXG4gICAgY3kuZ2V0KCdpbnB1dFtuYW1lPVwiZW1haWxcIl0nKS50eXBlKFwia2FkaUB0ZXN0LmNvbVwiKTtcclxuICAgIGN5LmdldCgnI2VtYWlsQWxlcnQgc3BhbltuZy1zaG93PVwibXlGb3JtLmVtYWlsLiRlcnJvci5lbWFpbFwiXScpLnNob3VsZChcclxuICAgICAgXCJub3QuYmUudmlzaWJsZVwiXHJcbiAgICApO1xyXG4gICAgY3kuZ2V0KFwiI2VtYWlsQWxlcnRcIikuc2hvdWxkKFwibm90LmJlLnZpc2libGVcIik7XHJcbiAgICBjeS5nZXQoXCIjY291bnRyeVwiKS5zZWxlY3QoXCJvYmplY3Q6NFwiKS5zaG91bGQoXCJjb250YWluXCIsIFwiRXN0b25pYVwiKTtcclxuICAgIGN5LmdldChcIiNjaXR5XCIpLnNlbGVjdChcIlRhcnR1XCIpLnNob3VsZChcImNvbnRhaW5cIiwgXCJUYXJ0dVwiKTtcclxuICAgIGN5LmdldChcIiNiaXJ0aGRheVwiKS50eXBlKFwiMTk5NS0wMy0yOVwiKTtcclxuICAgIGN5LmdldCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuZXEoMCkuY2hlY2soKTtcclxuICAgIGN5LmdldCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuZXEoMCkuc2hvdWxkKFwiYmUuY2hlY2tlZFwiKTtcclxuICAgIGN5LmdldChcIiNjaGVja2JveEFsZXJ0XCIpLnNob3VsZChcIm5vdC5iZS52aXNpYmxlXCIpO1xyXG4gICAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJykuY2xpY2soKTtcclxuICAgIGN5LmdvKFwiYmFja1wiKTtcclxuICAgIGN5LmxvZyhcIkJhY2sgYWdhaW4gaW4gUmVnaXN0cmF0aW9uIGZvcm0gM1wiKTtcclxuICB9KTtcclxuXHJcbiAgaXQub25seShcIk1hbmRhdG9yeSBmaWVsZHMgYXJlIGFic2VudCB3aXRoIGNvcnJlc3BvbmRpbmcgYXNzZXJ0aW9uc1wiLCAoKSA9PiB7XHJcbiAgICBpbnB1dEVtcHR5TWFuZGF0b3J5RmllbGRzKCk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gaW5wdXRFbXB0eU1hbmRhdG9yeUZpZWxkcygpIHtcclxuICBjeS5sb2coXCJMZWF2aW5nIG1hbmRhdG9yeSBmaWVsZHMgZW1wdHlcIik7XHJcbiAgY3kuZ2V0KCdpbnB1dFtuYW1lPVwiZW1haWxcIl0nKS5jbGVhcigpLnR5cGUoXCJhXCIpLmNsZWFyKCkuYmx1cigpO1xyXG4gIGN5LmdldChcIiNuYW1lXCIpLmNsZWFyKCkudHlwZShcImFcIikuY2xlYXIoKS5ibHVyKCk7XHJcblxyXG4gIC8vIENoZWNrIGlmIHRoZSBlbWFpbCBhbGVydCBlbGVtZW50IGlzIHZpc2libGVcclxuICBjeS5nZXQoXCJkaXYjZW1haWxBbGVydFwiKS5zaG91bGQoXCJiZS52aXNpYmxlXCIpO1xyXG5cclxuICAvLyBFbnN1cmUgdGhlIHNwZWNpZmljIHJlcXVpcmVkIGVtYWlsIG1lc3NhZ2UgaXMgdmlzaWJsZVxyXG4gIGN5LmdldChcImRpdiNlbWFpbEFsZXJ0IHNwYW5bbmctc2hvdz0nbXlGb3JtLmVtYWlsLiRlcnJvci5yZXF1aXJlZCddXCIpXHJcbiAgICAuc2hvdWxkKFwiYmUudmlzaWJsZVwiKVxyXG4gICAgLmFuZChcImNvbnRhaW5cIiwgXCJFbWFpbCBpcyByZXF1aXJlZFwiKTtcclxuXHJcbiAgY3kuZ2V0KCdpbnB1dFtuZy1tb2RlbD1cImNoZWNrYm94XCJdJykudW5jaGVjaygpO1xyXG5cclxuICBjeS5jb250YWlucyhcIiNjaGVja2JveEFsZXJ0XCIsIFwiQ2hlY2tib3ggaXMgcmVxdWlyZWRcIikuc2hvdWxkKFxyXG4gICAgXCJub3QuYmUudmlzaWJsZVwiXHJcbiAgKTtcclxuXHJcbiAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5lcSgxKS5zaG91bGQoXCJub3QuYmUuY2hlY2tlZFwiKTtcclxuXHJcbiAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJykuc2hvdWxkKFwiYmUuZGlzYWJsZWRcIik7XHJcbiAgY3kuZ2V0KCdpbnB1dFt0eXBlPVwiZGF0ZVwiXScpLmZpcnN0KCkudHlwZShcIjIwMjQtMDctMTJcIik7XHJcblxyXG4gIGNvbnN0IGZpbGVOYW1lID0gXCJleGFtcGxlX2ZpbGVfZm9ybTNcIjtcclxuICBjeS5nZXQoXCIjbXlGaWxlXCIpLmF0dGFjaEZpbGUoZmlsZU5hbWUpO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiYmVmb3JlRWFjaCIsImN5IiwidmlzaXQiLCJkZXNjcmliZSIsIml0IiwiZ2V0IiwiY2hpbGRyZW4iLCJzaG91bGQiLCJmaW5kIiwic2VsZWN0IiwiZXhwZWN0ZWRDaXR5T3B0aW9ucyIsInRoZW4iLCIkb3B0aW9ucyIsImFjdHVhbENpdHlPcHRpb25zIiwibWFwIiwib3B0aW9uIiwidGV4dCIsImV4cGVjdCIsInRvIiwiZGVlcCIsImVxIiwibmV4dCIsImNoZWNrIiwiY2xpY2siLCJ1cmwiLCJnbyIsInR5cGUiLCJhbmQiLCJjbGVhciIsInRvZGF5IiwiRGF0ZSIsImRhdGUiLCJ0b0lTT1N0cmluZyIsInNwbGl0IiwiZmlyc3QiLCJmaWxlTmFtZSIsImF0dGFjaEZpbGUiLCJsb2ciLCJvbmx5IiwiaW5wdXRFbXB0eU1hbmRhdG9yeUZpZWxkcyIsImJsdXIiLCJ1bmNoZWNrIiwiY29udGFpbnMiXSwic291cmNlUm9vdCI6IiJ9