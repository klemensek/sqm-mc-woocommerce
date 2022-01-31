<?php

/**
 * Created by Vextras.
 *
 * Name: Ryan Hungate
 * Email: ryan@vextras.com
 * Date: 7/13/16
 * Time: 8:29 AM
 */
class SqualoMail_WooCommerce_Transform_Categories
{
    /**
     * @param int $page
     * @param int $limit
     * @return \stdClass
     */
    public function compile($page = 1, $limit = 5)
    {
        $response = (object) array(
            'endpoint' => 'categories',
            'page' => $page ? $page : 1,
            'limit' => (int) $limit,
            'count' => 0,
            'stuffed' => false,
            'items' => array(),
        );

        if ((($categories = $this->getCategoryIds($page, $limit)) && !empty($categories))) {
            foreach ($categories as $term_id) {
                $response->items[] = $term_id;
                $response->count++;
            }
        }

        $response->stuffed = ($response->count > 0 && (int) $response->count === (int) $limit) ? true : false;

        return $response;
    }

    /**
     * @param int $page
     * @param int $posts
     * @return array|bool
     */
    public function getCategoryIds($page = 1, $posts = 5)
    {
        $offset = 0;

        if ($page > 1) {
            $offset = (($page-1) * $posts);
        }

        $params = array(
            'number' => $posts,
            'offset' => $offset,
            'orderby' => 'ID',
            'order' => 'ASC',
            'fields' => 'ids',
            'taxonomy' => 'product_cat',
            'hide_empty' => false
        );

        $categories = get_terms($params);

        if (empty($categories)) {
            sleep(2);
            $categories = get_terms($params);
            if (empty($categories)) {
                return false;
            }
        }

        return $categories;
    }

    /**
     * @param WP_Term $term
     * @return SqualoMail_WooCommerce_Category
     */
    public function transform(WP_Term $term)
    {
        if (!($woo = get_term($term))) {
            return $this->wooCategoryNotLoadedCorrectly($term);
        }

        $category = new SqualoMail_WooCommerce_Category();
        $category->setId($woo->term_id);
        $category->setHandle($woo->slug);
        $category->setTitle($woo->name);
        $category->setProductIds($woo->term_id);

        return $category;
    }

    /**
     * @param \WP_Term $term
     * @return SqualoMail_WooCommerce_Category
     */
    protected function wooCategoryNotLoadedCorrectly($term)
    {
        $category = new SqualoMail_WooCommerce_Category();
        $category->setId($term->term_id);
        $category->setTitle($term->name);
        $category->setHandle($term->slug);
        $category->setProductIds($term->term_id);

        return $category;
    }
}
