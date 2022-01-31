<?php

/**
 * Created by Vextras.
 *
 * Name: Ryan Hungate
 * Email: ryan@vextras.com
 * Date: 3/8/16
 * Time: 2:17 PM
 */
class SqualoMail_WooCommerce_Category
{
    protected $id;
    protected $title;
    protected $handle = null;
    protected $product_ids = array();

    /**
     * @return array
     */
    public function getValidation()
    {
        return array(
            'id' => 'required|string',
            'title' => 'required|string',
            'handle' => 'string',
            'product_ids' => 'required|array',
        );
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return SqualoMail_WooCommerce_Category
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     * @return SqualoMail_WooCommerce_Category
     */
    public function setTitle($title)
    {
        $this->title = strip_tags($title);

        return $this;
    }

    /**
     * @return null
     */
    public function getHandle()
    {
        return $this->handle;
    }

    /**
     * @param null $handle
     * @return SqualoMail_WooCommerce_Category
     */
    public function setHandle($handle)
    {
        $this->handle = $handle;

        return $this;
    }

    /**
     * @return null
     */
    public function getProductIds()
    {
        return $this->product_ids;
    }

    /**
     * @param null $product_ids
     * @return SqualoMail_WooCommerce_Category
     */
    public function setProductIds($term_id)
    {   
        if(!$term_id) {
            return array();
        }

        $args = array(
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'tax_query' => array(
                array(
                    'taxonomy' => 'product_cat',
                    'field' => 'term_id',
                    'terms' => $term_id,
                    'operator' => 'IN'
                ),
            )
        );
        $products = new WP_Query($args);
        $product_ids = wp_list_pluck($products->posts, 'ID');

        $this->product_ids = $product_ids;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return array(
            'id' => (string) $this->getId(),
            'title' => $this->getTitle(),
            'handle' => (string) $this->getHandle(),
            'product_ids' => (array) $this->getProductIds()
        );
    }

    /**
     * @param array $data
     * @return SqualoMail_WooCommerce_Category
     */
    public function fromArray(array $data)
    {
        $singles = array(
            'id', 'title', 'handle', 'product_ids'
        );

        foreach ($singles as $key) {
            if (array_key_exists($key, $data)) {
                $this->$key = $data[$key];
            }
        }

        return $this;
    }
}
