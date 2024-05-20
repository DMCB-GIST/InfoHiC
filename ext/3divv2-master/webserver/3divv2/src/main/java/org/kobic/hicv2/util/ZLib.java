package org.kobic.hicv2.util;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

public class ZLib {
	public static String decompress( byte[] compressedBytes ) throws DataFormatException, UnsupportedEncodingException {
		Inflater decompresser = new Inflater();
		decompresser.setInput(compressedBytes, 0, compressedBytes.length);
		byte[] result = new byte[50000];
//		byte[] result = new byte[5000000];
		int resultLength = decompresser.inflate(result);
		decompresser.end();
		
	    String res = new String(result, 0, resultLength, "UTF-8");
	    
	    return res;
	}
	
	public static byte[] compress( String str ) throws UnsupportedEncodingException {
		// Compress the bytes
		byte[] output = new byte[str.length()];
		Deflater deflater = new Deflater();
		deflater.setInput( str.getBytes("UTF-8") );
		deflater.finish();
		int compressedDataLength = deflater.deflate(output);
		deflater.end();
		
		return Arrays.copyOfRange( output, 0, compressedDataLength );
	}
}