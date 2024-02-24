import { TreeSelect, message } from "antd";
import { DefaultOptionType } from "antd/es/select";
import React, { useEffect, useState } from "react";
import { setCategory, setIsLoading } from "../../../../redux/reduxSlices/filtersSlice";
import { useDispatch } from "react-redux";
import propertyCategoriesService from "../../../../services/admin/property-categories.service";
import { useNavigate } from "react-router-dom";
import './caetgoryTree.scss'

interface CategoryTreeProps {
  label?: string;
  width?: string;
  text?: string;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ 
  label,
  text,
  width = "100%", 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ categoryTitle ] = useState<string>();
  const [ categoryTree, setCategoryTree ] = useState<DefaultOptionType[] | undefined>(undefined);

  // fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setIsLoading(true));

        // Fetch categories data
        const categoryResponse = await propertyCategoriesService.getCategoryTree();
        if (categoryResponse.code === 200) {
          setCategoryTree(categoryResponse.categoryTree);
        } else {
          message.error(categoryResponse.error, 3);
          return;
        }

      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching data', 2);
          console.log('Error occurred:', err);
        }
      } finally {
        dispatch(setIsLoading(false));
      }
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='category-filter'>
      {label && (
        <span style={{marginBottom: ".5rem"}}>{ label }</span>
      )}
      <TreeSelect
        style={{ width: `${width}` }}
        value={categoryTitle}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={categoryTree}
        placeholder={text}
        className="custom-tree-select"
        treeDefaultExpandAll
        onChange={(selectedNode: any) => dispatch(setCategory(selectedNode.label))}
        labelInValue
        treeLine
      />
    </div>
  )
}

export default CategoryTree;