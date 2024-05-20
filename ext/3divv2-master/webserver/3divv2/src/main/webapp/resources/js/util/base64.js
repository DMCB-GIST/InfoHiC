if (typeof TextEncoder === "undefined") {
    TextEncoder=function TextEncoder(){};
    TextEncoder.prototype.encode = function encode(str) {
        "use strict";
        var Len = str.length, resPos = -1;
        // The Uint8Array's length must be at least 3x the length of the string because an invalid UTF-16
        //  takes up the equivelent space of 3 UTF-8 characters to encode it properly. However, Array's
        //  have an auto expanding length and 1.5x should be just the right balance for most uses.
        var resArr = typeof Uint8Array === "undefined" ? new Array(Len * 1.5) : new Uint8Array(Len * 3);
        for (var point=0, nextcode=0, i = 0; i !== Len; ) {
            point = str.charCodeAt(i), i += 1;
            if (point >= 0xD800 && point <= 0xDBFF) {
                if (i === Len) {
                    resArr[resPos += 1] = 0xef/*0b11101111*/; resArr[resPos += 1] = 0xbf/*0b10111111*/;
                    resArr[resPos += 1] = 0xbd/*0b10111101*/; break;
                }
                // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                nextcode = str.charCodeAt(i);
                if (nextcode >= 0xDC00 && nextcode <= 0xDFFF) {
                    point = (point - 0xD800) * 0x400 + nextcode - 0xDC00 + 0x10000;
                    i += 1;
                    if (point > 0xffff) {
                        resArr[resPos += 1] = (0x1e/*0b11110*/<<3) | (point>>>18);
                        resArr[resPos += 1] = (0x2/*0b10*/<<6) | ((point>>>12)&0x3f/*0b00111111*/);
                        resArr[resPos += 1] = (0x2/*0b10*/<<6) | ((point>>>6)&0x3f/*0b00111111*/);
                        resArr[resPos += 1] = (0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/);
                        continue;
                    }
                } else {
                    resArr[resPos += 1] = 0xef/*0b11101111*/; resArr[resPos += 1] = 0xbf/*0b10111111*/;
                    resArr[resPos += 1] = 0xbd/*0b10111101*/; continue;
                }
            }
            if (point <= 0x007f) {
                resArr[resPos += 1] = (0x0/*0b0*/<<7) | point;
            } else if (point <= 0x07ff) {
                resArr[resPos += 1] = (0x6/*0b110*/<<5) | (point>>>6);
                resArr[resPos += 1] = (0x2/*0b10*/<<6)  | (point&0x3f/*0b00111111*/);
            } else {
                resArr[resPos += 1] = (0xe/*0b1110*/<<4) | (point>>>12);
                resArr[resPos += 1] = (0x2/*0b10*/<<6)    | ((point>>>6)&0x3f/*0b00111111*/);
                resArr[resPos += 1] = (0x2/*0b10*/<<6)    | (point&0x3f/*0b00111111*/);
            }
        }
        if (typeof Uint8Array !== "undefined") return resArr.subarray(0, resPos + 1);
        // else // IE 6-9
        resArr.length = resPos + 1; // trim off extra weight
        return resArr;
    };
    TextEncoder.prototype.toString = function(){return "[object TextEncoder]"};
    try { // Object.defineProperty only works on DOM prototypes in IE8
        Object.defineProperty(TextEncoder.prototype,"encoding",{
            get:function(){if(TextEncoder.prototype.isPrototypeOf(this)) return"utf-8";
                           else throw TypeError("Illegal invocation");}
        });
    } catch(e) { /*IE6-8 fallback*/ TextEncoder.prototype.encoding = "utf-8"; }
    if(typeof Symbol!=="undefined")TextEncoder.prototype[Symbol.toStringTag]="TextEncoder";
}

function Base64Decode(str) {
    if (!(/^[a-z0-9+/]+={0,2}$/i.test(str)) || str.length%4 != 0) throw Error('Not base64 string');

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, d=[];

    for (var c=0; c<str.length; c+=4) {  // unpack four hexets into three octets
        h1 = b64.indexOf(str.charAt(c));
        h2 = b64.indexOf(str.charAt(c+1));
        h3 = b64.indexOf(str.charAt(c+2));
        h4 = b64.indexOf(str.charAt(c+3));

        bits = h1<<18 | h2<<12 | h3<<6 | h4;

        o1 = bits>>>16 & 0xff;
        o2 = bits>>>8 & 0xff;
        o3 = bits & 0xff;

        d[c/4] = String.fromCharCode(o1, o2, o3);
        // check for padding
        if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
        if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
    }
    str = d.join('');  // use Array.join() for better performance than repeated string appends

    return str;
}

var toBase64 = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
];

var fromBase64 = new Array(256).fill(-1);

for (var i = 0; i < toBase64.length; i++)
    fromBase64[toBase64[i].charCodeAt(0)] = i;
fromBase64['='.charCodeAt(0)] = -2;

function outLength( src, sp, sl) {
    var base64 = fromBase64;
    var paddings = 0;
    var len = sl - sp;
    var isMIME = false;
    if (len == 0)
        return 0;
    if (len < 2) {
        if (isMIME && base64[0] == -1)
            return 0;
        throw new IllegalArgumentException(
            "Input byte[] should at least have 2 bytes for base64 bytes");
    }
    if (isMIME) {
        // scan all bytes to fill out all non-alphabet. a performance
        // trade-off of pre-scan or Arrays.copyOf
        var n = 0;
        while (sp < sl) {
            var b = src[sp++] & 0xff;
            if (b == '=') {
                len -= (sl - sp + 1);
                break;
            }
            if ((b = base64[b]) == -1)
                n++;
        }
        len -= n;
    } else {
        if (src[sl - 1] == '=') {
            paddings++;
            if (src[sl - 2] == '=')
                paddings++;
        }
    }
    if (paddings == 0 && (len & 0x3) !=  0)
        paddings = 4 - (len & 0x3);
    return parseInt(3 * ((len + 3) / 4) - paddings);
}

function decode0(src, sp, sl, dst) {
    var base64 = fromBase64;
    var dp = 0;
    var bits = 0;
    var shiftto = 18;       // pos of first byte of 4-byte atom
    var isMIME = false;
    while (sp < sl) {
        var b = src[sp++] & 0xff;
        if ((b = base64[b]) < 0) {
            if (b == -2) {
                if (shiftto == 6 && (sp == sl || src[sp++] != '='.charCodeAt(0)) || shiftto == 18) {
                    console.log(
                        "Input byte array has wrong 4-byte ending unit");
                }
                break;
            }
            if (isMIME)    // skip if for rfc2045
                continue;
            else
            	console.log("Error")
//               console.log(
//                    "Illegal base64 character " +
//                    Integer.toString(src[sp - 1], 16));
        }
        bits |= (b << shiftto);
        shiftto -= 6;
        if (shiftto < 0) {
//            o1 = bits>>>16 & 0xff;
//            o2 = bits>>>8 & 0xff;
//            o3 = bits & 0xff;
            dst[dp++] = getVal(bits >> 16);
            dst[dp++] = getVal(bits >>  8);
            dst[dp++] = getVal(bits);
            shiftto = 18;
            bits = 0;
        }
    }

    // reached end of byte array or hit padding '=' characters.
    if (shiftto == 6) {
        dst[dp++] = getVal(bits >> 16);
    } else if (shiftto == 0) {
        dst[dp++] = getVal(bits >> 16);
        dst[dp++] = getVal(bits >>  8);
    } else if (shiftto == 12) {
        // dangling single "x", incorrectly encoded.
    	console.log(
            "Last unit does not have enough valid bits");
    }
    // anything left is invalid, if is not MIME.
    // if MIME, ignore all non-base64 character
    while (sp < sl) {
        if (isMIME && base64[src[sp++]] < 0)
            continue;
        console.log(
            "Input byte array has incorrect ending byte at " + sp);
    }
    return dp;
}

function decode(str) {
	var src = new TextEncoder().encode( str, 'windows-1252' );
	var dst = new Array(outLength(src, 0, src.length));

	var ret = decode0(src, 0, src.length, dst);
    if (ret != dst.length) {
    	dst = dst.slice(0, ret);
    }

//	console.log( str.length + "(" + dst.length + ")" + " == " + ret );
    return dst;
}

function decodeBase64T(str) {
	var src = new TextEncoder().encode( str, 'windows-1252' );
	var dst = new Array(outLength(src, 0, src.length));

	var ret = decode0(src, 0, src.length, dst);
    if (ret != dst.length) {
    	dst = dst.slice(0, ret);
    }

//	console.log( str.length + "(" + dst.length + ")" + " == " + ret );
    return dst;
}

function getVal(val){
	var b = new Int8Array(1);
	b[0] = val;
	return b[0];
}