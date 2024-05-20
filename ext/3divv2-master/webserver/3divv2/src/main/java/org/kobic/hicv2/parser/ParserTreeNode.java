/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package org.kobic.hicv2.parser;

/**
 *
 * @author SUN2K
 */
public class ParserTreeNode {

        public ParserTreeNode   leftTree;
        public ParserTreeNode   rightTree;
        public Object           value;

        public ParserTreeNode(ParserTreeNode l, ParserTreeNode r, Object v)
        {
            leftTree = l;
            rightTree = r;
            value = v;
        }

        public ParserTreeNode(Object l, Object r, Object v)
        {
            leftTree = new ParserTreeNode(l);
            rightTree = new ParserTreeNode(r);
            value = v;
        }

        public ParserTreeNode()
        {
            leftTree = rightTree = null;
            value = null;
        }

        public ParserTreeNode(Object v)
        {
            leftTree = rightTree = null;
            value = v;
        }

        public void printTreePostOrder()
        {
            printTreePostOrder(this);
            System.out.println();
        }

        private void printTreePostOrder(ParserTreeNode tree)
        {
            if (tree == null)
                return;
            printTreePostOrder(tree.leftTree);
            printTreePostOrder(tree.rightTree);
            System.out.print(tree.value.toString() + " ");
        }

        public boolean isValueDouble()
        {
            String s = value.toString();

            for (int i = 0; i < s.length(); i++)
                if ( !( (s.charAt(i) >= '0' && s.charAt(i) <= '9') || s.charAt(i) == '.') )
                    return false;
            return true;
        }
}
