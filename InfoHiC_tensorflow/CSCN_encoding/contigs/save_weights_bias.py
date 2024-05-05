import numpy as np
from tensorflow.python import pywrap_tensorflow
import os
import sys
import tensorflow as tf
if int(tf.__version__.split(sep=".")[0]) > 1:
    import tensorflow.compat.v1 as tf
    tf.disable_v2_behavior()


#checkpoint_path = 'best_checkpoint-469412'
checkpoint_path=sys.argv[1]
#reader = pywrap_tensorflow.NewCheckpointReader(checkpoint_path)
reader = tf.train.NewCheckpointReader(checkpoint_path)

var_to_shape_map = reader.get_variable_to_shape_map()

#for key in var_to_shape_map:
#    print("tensor_name: ", key)

#reader.get_tensor('Convolutional_stack/conv_layer1/weights')
#reader.get_tensor('Convolutional_stack/conv_layer1/weights')
#reader.get_tensor('Convolutional_stack/conv_layer1/weights')
#reader.get_tensor('Convolutional_stack/conv_layer1/weights')
#reader.get_tensor('Convolutional_stack/conv_layer1/weights')
#reader.get_tensor('Convolutional_stack/conv_layer1/weights')
#reader.get_tensor('Convolutional_stack/conv_layer1/weights')


np.savez(
	'weight_bias.npz',
	c1w=reader.get_tensor('Convolutional_stack/conv_layer1/weights'),
        c1b=reader.get_tensor('Convolutional_stack/conv_layer1/biases'),
        c2w=reader.get_tensor('Convolutional_stack/conv_layer2/weights'),
        c2b=reader.get_tensor('Convolutional_stack/conv_layer2/biases'),
        c3w=reader.get_tensor('Convolutional_stack/conv_layer3/weights'),
        c3b=reader.get_tensor('Convolutional_stack/conv_layer3/biases'),
        c4w=reader.get_tensor('Convolutional_stack/conv_layer4/weights'),
        c4b=reader.get_tensor('Convolutional_stack/conv_layer4/biases'),
        c5w=reader.get_tensor('Convolutional_stack/conv_layer5/weights'),
        c5b=reader.get_tensor('Convolutional_stack/conv_layer5/biases'),
        c6w=reader.get_tensor('Convolutional_stack/conv_layer6/weights'),
        c6b=reader.get_tensor('Convolutional_stack/conv_layer6/biases'),

        d1w=reader.get_tensor('dilated_stack/dilated_layer1/dilation_weights'),
        d1b=reader.get_tensor('dilated_stack/dilated_layer1/dilation_biases'),
        d1gw=reader.get_tensor('dilated_stack/dilated_layer1/gate_weights'),
        d1gb=reader.get_tensor('dilated_stack/dilated_layer1/gate_biases'),
        d1dw=reader.get_tensor('dilated_stack/dilated_layer1/dense_weights'),
        d1db=reader.get_tensor('dilated_stack/dilated_layer1/dense_biases'),

        d1_1w=reader.get_tensor('dilated_stack/dilated_layer1_1/dilation_weights'),
        d1_1b=reader.get_tensor('dilated_stack/dilated_layer1_1/dilation_biases'),
        d1_1gw=reader.get_tensor('dilated_stack/dilated_layer1_1/gate_weights'),
        d1_1gb=reader.get_tensor('dilated_stack/dilated_layer1_1/gate_biases'),
        d1_1dw=reader.get_tensor('dilated_stack/dilated_layer1_1/dense_weights'),
        d1_1db=reader.get_tensor('dilated_stack/dilated_layer1_1/dense_biases'),

        d2w=reader.get_tensor('dilated_stack/dilated_layer2/dilation_weights'),
        d2b=reader.get_tensor('dilated_stack/dilated_layer2/dilation_biases'),
        d2gw=reader.get_tensor('dilated_stack/dilated_layer2/gate_weights'),
        d2gb=reader.get_tensor('dilated_stack/dilated_layer2/gate_biases'),
        d2dw=reader.get_tensor('dilated_stack/dilated_layer2/dense_weights'),
        d2db=reader.get_tensor('dilated_stack/dilated_layer2/dense_biases'),


        d3w=reader.get_tensor('dilated_stack/dilated_layer3/dilation_weights'),
        d3b=reader.get_tensor('dilated_stack/dilated_layer3/dilation_biases'),
        d3gw=reader.get_tensor('dilated_stack/dilated_layer3/gate_weights'),
        d3gb=reader.get_tensor('dilated_stack/dilated_layer3/gate_biases'),
        d3dw=reader.get_tensor('dilated_stack/dilated_layer3/dense_weights'),
        d3db=reader.get_tensor('dilated_stack/dilated_layer3/dense_biases'),


        d4w=reader.get_tensor('dilated_stack/dilated_layer4/dilation_weights'),
        d4b=reader.get_tensor('dilated_stack/dilated_layer4/dilation_biases'),
        d4gw=reader.get_tensor('dilated_stack/dilated_layer4/gate_weights'),
        d4gb=reader.get_tensor('dilated_stack/dilated_layer4/gate_biases'),
        d4dw=reader.get_tensor('dilated_stack/dilated_layer4/dense_weights'),
        d4db=reader.get_tensor('dilated_stack/dilated_layer4/dense_biases'),


        d5w=reader.get_tensor('dilated_stack/dilated_layer5/dilation_weights'),
        d5b=reader.get_tensor('dilated_stack/dilated_layer5/dilation_biases'),
        d5gw=reader.get_tensor('dilated_stack/dilated_layer5/gate_weights'),
        d5gb=reader.get_tensor('dilated_stack/dilated_layer5/gate_biases'),
        d5dw=reader.get_tensor('dilated_stack/dilated_layer5/dense_weights'),
        d5db=reader.get_tensor('dilated_stack/dilated_layer5/dense_biases'),


        d6w=reader.get_tensor('dilated_stack/dilated_layer6/dilation_weights'),
        d6b=reader.get_tensor('dilated_stack/dilated_layer6/dilation_biases'),
        d6gw=reader.get_tensor('dilated_stack/dilated_layer6/gate_weights'),
        d6gb=reader.get_tensor('dilated_stack/dilated_layer6/gate_biases'),
        d6dw=reader.get_tensor('dilated_stack/dilated_layer6/dense_weights'),
        d6db=reader.get_tensor('dilated_stack/dilated_layer6/dense_biases'),


        d7w=reader.get_tensor('dilated_stack/dilated_layer7/dilation_weights'),
        d7b=reader.get_tensor('dilated_stack/dilated_layer7/dilation_biases'),
        d7gw=reader.get_tensor('dilated_stack/dilated_layer7/gate_weights'),
        d7gb=reader.get_tensor('dilated_stack/dilated_layer7/gate_biases'),
        d7dw=reader.get_tensor('dilated_stack/dilated_layer7/dense_weights'),
        d7db=reader.get_tensor('dilated_stack/dilated_layer7/dense_biases'),


        d8w=reader.get_tensor('dilated_stack/dilated_layer8/dilation_weights'),
        d8b=reader.get_tensor('dilated_stack/dilated_layer8/dilation_biases'),
        d8gw=reader.get_tensor('dilated_stack/dilated_layer8/gate_weights'),
        d8gb=reader.get_tensor('dilated_stack/dilated_layer8/gate_biases'),
        d8dw=reader.get_tensor('dilated_stack/dilated_layer8/dense_weights'),
        d8db=reader.get_tensor('dilated_stack/dilated_layer8/dense_biases'),

        d9w=reader.get_tensor('dilated_stack/dilated_layer9/dilation_weights'),
        d9b=reader.get_tensor('dilated_stack/dilated_layer9/dilation_biases'),
        d9gw=reader.get_tensor('dilated_stack/dilated_layer9/gate_weights'),
        d9gb=reader.get_tensor('dilated_stack/dilated_layer9/gate_biases'),
        d9dw=reader.get_tensor('dilated_stack/dilated_layer9/dense_weights'),
        d9db=reader.get_tensor('dilated_stack/dilated_layer9/dense_biases'),

        fw=reader.get_tensor('final_dense/weights'),
        fb=reader.get_tensor('final_dense/biases'),

)
